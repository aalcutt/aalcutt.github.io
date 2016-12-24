
var mapDrawn = false;
var player = {
  x: 1,
  y: 1
}
var collectedCode = "_____-_____-_____";
var hiddenCode = "AF7B0-N459A-KLUP1";
var map;
var mapWidth = 100;
var mapHeight = 100;
var shuffledCodeArray = null;
var gameWasLoaded = false;
var collectedLetterCoords = [];

$(function() {
  var myrandom = new Math.seedrandom("12345");
  shuffledCodeArray = hiddenCode.replaceAll("-","").split('').sort(function(){return 0.5-myrandom.quick()});
  var savedState = LoadState();
  if(savedState){
    player = savedState.player;
    collectedCode = savedState.collectedCode;
    collectedLetterCoords = savedState.collectedLetterCoords;
    gameWasLoaded = true;
  }

  $('body').on('keyup', function(e) {
      var keyCode = e.which;
      var input = ConvertKeyToInput(keyCode);
      if (input != null) {
          MovePlayer(input);
      }
  });
  $('#controls li').click(function () {
      var input = $(this).data("control");
      MovePlayer(input);
  });
  $("#code").text(collectedCode);
  LoadMap();

  if(!gameWasLoaded){
    setTimeout(function(){
      alert("Welcome to The Maze.\n\nHidden in these walls are the first 15 characters of the code.\n\nWill you be able to find them?")
    }, 500);
  }
});

function MovePlayer(input){
  var future = {
    x: player.x,
    y: player.y
  }
  switch(input){
    case "down":
      future.y++;
    break;
    case "up":
      future.y--;
    break;
    case "left":
      future.x--;
    break;
    case "right":
      future.x++;
    break;
  }

  if(ValidFuturePosition(future)){
    var whatsAtFuture = map[future.x][future.y];
    if(whatsAtFuture != "wall" && whatsAtFuture != ""){
      var letterCode = whatsAtFuture;
      AddCollectedLetter(whatsAtFuture);
      collectedLetterCoords.push({x: future.x, y: future.y});
    }

    map[player.x][player.y] = "";
    player.x = future.x;
    player.y = future.y;
    map[player.x][player.y] = "player";
    Update();
    SaveState();

    if(collectedLetterCoords.length + 2 == 17){
      alert("Congratulations you found the entire code!\n" + collectedCode);
    }
  }
}

function ValidFuturePosition(futurePosition){
  var futureTile = map[futurePosition.x][futurePosition.y];
  if(futureTile == "wall"){
    return false;
  }
  if(futurePosition.x < 0 || futurePosition.x > map[0].length){
    return false;
  }
  if(futurePosition.y < 0 || futurePosition.y > map.length){
    return false;
  }

  return true;
}

function ConvertKeyToInput(key) {
    var controlMapping = {
        '37': 'left',
        '38': 'up',
        '39': 'right',
        '40': 'down'
    };
    var input = controlMapping[key];
    return input != null ? input : null;
}

function Update() {
    if (mapDrawn == false) {
        console.log("map isn't finished drawing.")
        return;
    }
    DrawMapGrid();
}

function CreateIconHtml(type) {
    var iconName = "";
    var style = "";
    var color = "";

    if(type == ""){
      return "";
    }

    if(type == null || type == undefined){
      return "E"
    }

    if(type == "wall"){
      iconName = "fa-database"
    }
    else if (type == "player") {
      iconName = "fa-male";
      color = "#00f"
    }
    else{
      color = "#f00";
      return "<span style='color:#f00'>" + type + "</span>";
    }

    if (color != null && color != "") {
        style = "color:" + color;
    }
    return "<i class='fa " + iconName + " fa-3x' style='" + style + "'></i>";
}

function LoadMap() {
  var mapDataSplit = mapData.split(",")
  var counter = 0;
  map = new Array(mapWidth);
  for(var i = 0; i < mapWidth; i++){
    map[i] = new Array(mapHeight);
    for(var j = 0; j < mapHeight; j++){
      var tile = mapDataSplit[counter];

      if(gameWasLoaded){
        if(tile == "player"){
          tile = "";
        }
        if(tile == "code" && AlreadyFoundThisCode(i, j)){
          tile = "";
        }
      }

      if(tile == "code"){
        tile = GetLetterForCodeTile();
      }

      map[i][j] = tile;
      counter++;
    }
  }


  if(gameWasLoaded){
    map[player.x][player.y] = "player"
  }

  DrawMapGrid();
  mapDrawn = true;
}

function DrawMapGrid() {
    var mapString = "<table>";
    var middleOfScreen = {x: 3, y: 3};
    var offSetY = 0;
    var offSetX = 0;

    if (player.y > middleOfScreen.y) {
        if(player.y < (mapHeight - 3) ){
            offSetY = player.y - 3;
        }
        else if(player.y == mapHeight - 2){
          offSetY = player.y - 5;
        }
        else if (player.y == mapHeight - 3) {
            offSetY = player.y - 4;
        }
    }

    if (player.x > middleOfScreen.x) {
       if (player.x < (mapWidth - 3)) {
           offSetX = player.x - 3;
       }
       else if (player.x == mapWidth - 2) {
           offSetX = player.x - 5;
       }
       else if (player.x == mapWidth - 3) {
           offSetX = player.x - 4;
       }
   }

    for (var y = 0; y < 7; y++) {
        mapString += "<tr>";
        for (var x = 0; x < 7; x++) {
            var xOffset = offSetX + x;
            var yOffset = offSetY + y;
            var tileType = map[xOffset][yOffset];
            var icon = CreateIconHtml(tileType);

            mapString += "<td pos-x='{x}' pos-y='{y}'>{icon}</td>".replace("{x}", xOffset).replace("{y}", yOffset).replace("{icon}", icon);
        }
        mapString += "</tr>";
    }

    mapString += "</table>";

    $('#map').html(mapString);
}

function AddCollectedLetter(letter){
  var possibleIndexes = [];
  for(var i = 0; i < hiddenCode.length; i++){
    if(hiddenCode[i] == letter){
      possibleIndexes.push(i);
    }
  }

 for(var i = 0; i < possibleIndexes.length; i++){
   if(collectedCode.charAt(possibleIndexes[i]) == "_"){
     collectedCode = collectedCode.replaceAt(possibleIndexes[i], letter);
     break;
   }
 }

  $("#code").text(collectedCode);
}

function GetMapElementForPosition(x, y) {
    var selector = '#map table tr td[pos-x="{x}"][pos-y="{y}"]'.replace("{x}", x).replace("{y}", y);
    return $(selector);
}

function GetLetterForCodeTile(){
  if(shuffledCodeArray.length > 0){
    return shuffledCodeArray.pop();
  }
  return null;
}

function cheat(x, y){
  player.x = x;
  player.y = y;
  Update();
}

function SaveState(){
  if(window.localStorage){
    var saved = {
      player: player,
      collectedCode: collectedCode,
      collectedLetterCoords: collectedLetterCoords
    }
    window.localStorage.setItem("savedMaze", JSON.stringify(saved));
  }
}

function LoadState(){
  if(!window.localStorage){
    return null;
  }
  var savedString = window.localStorage.getItem("savedMaze");
  if(!savedString){
    return null;
  }

  try{
    var saved = JSON.parse(savedString);
    return saved;
  }
  catch(e){
    return null;
  }
}

function AlreadyFoundThisCode(x, y){
  for(var i = 0; i < collectedLetterCoords.length; i++){
    if(collectedLetterCoords[i].x == x && collectedLetterCoords[i].y == y){
      return true;
      break;
    }
  }
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
