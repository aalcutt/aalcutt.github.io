
var mapDrawn = false;
var player = {
  x: 1,
  y: 1
}
var collectedCode = "_____-_____-_____-_____";
var hiddenCode = "AF7B0-N459A-KLUP1-6781Z";
var map;
var mapWidth = 100;
var mapHeight = 100;
var MAP_VIEWPORT_SIZE = 5;
var myrandom = new Math.seedrandom("12345");
var shuffledCodeArray = hiddenCode.split('').sort(function(){return 0.5-myrandom.quick()});

$(function() {
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

    LoadMap();
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
    }

    map[player.x][player.y] = "";
    player.x = future.x;
    player.y = future.y;
    map[player.x][player.y] = "player";
    Update();
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

    if(type == "wall"){
      iconName = "fa-database"
    }
    else if (type == "player") {
      iconName = "fa-male";
      color = "#00f"
    }
    else{
      return type;
    }

    if (color != null && color != "") {
        style = "color:" + color;
    }
    return "<i class='fa " + iconName + " fa-3x' style='" + style + "'></i>";
}

function LoadMap() {

  map = new Array(mapWidth);;

  var mapDataSplit = mapData.split(",")
  var counter = 0;
  for(var i = 0; i < mapWidth; i++){
    map[i] = new Array(mapHeight);
    for(var j = 0; j < mapHeight; j++){
      var tile = mapDataSplit[counter];

      if(tile == "code"){
        tile = GetLetterForCodeTile();
      }

      map[i][j] = tile;
      counter++;
    }
  }
  DrawMapGrid();
  mapDrawn = true;

  if (mapDrawn == false) {
      console.log("map isn't finished drawing.")
      return;
  }
}

function DrawMapGrid() {
    var mapString = "<table>";
    var middleOfScreen = {x: 2, y: 2};
    var offSetY = 0;
    var offSetX = 0;

    if (player.y > middleOfScreen.y) {
        if(player.y < (mapHeight - 2) ){
            offSetY = player.y - 2;
        }
        else if (player.y == mapHeight - 2) {
            offSetY = player.y - 3;
        }
    }

    if (player.x > middleOfScreen.x) {
       if (mapWidth > 5 && player.x < (mapWidth - 2)) {
           offSetX = player.x - 2;
       }
       else if (player.x == mapWidth - 2) {
           offSetX = player.x - 3;
       }
   }

    for (var y = 0; y < 5; y++) {
        mapString += "<tr>";
        for (var x = 0; x < 5; x++) {
            var xOffset = offSetX + x;
            var yOffset = offSetY + y;
            var icon = CreateIconHtml(map[xOffset][yOffset]);
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

  console.log(collectedCode);
  $("#code").text(collectedCode);
}

function GetMapElementForPosition(x, y) {
    var selector = '#map table tr td[pos-x="{x}"][pos-y="{y}"]'.replace("{x}", x).replace("{y}", y);
    return $(selector);
}

function GetLetterForCodeTile(){
  var shuffledCodeArray = hiddenCode.split('').sort(function(){return 0.5-myrandom.quick()});
  if(shuffledCodeArray.length > 0){
    return shuffledCodeArray.pop();
  }
  return null;
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}
