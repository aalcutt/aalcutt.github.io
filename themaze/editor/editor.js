var Editor = {
    defaultHeight: 10,
    defaultWidth: 10,
    creatableObjects:
        {
            key: {
                icon: 'fa-key',
                type: 'item',
                position: { x: null, y: null },
                id: null,
                color: null,
                editToId: null,
                newRoomPosition: {x: null, y: null}
            },
            gate: {
                icon: 'fa-bars',
                type: 'gate',
                position: { x: null, y: null },
                id: null,
                color: null,
            },
            wall: {
                icon: 'fa-database',
                type: 'wall',
                position: { x: null, y: null },
                id: null,
                color: null,
            },
            exit: {
                icon: 'exit',
                type: 'exit',
                position: { x: null, y: null },
                id: null,
                color: null,
            },
            blank: {
                icon: 'fa-none',
                type: 'none'
            },
            player: {
              icon: 'fa-male',
              type: 'player',
              position: { x: null, y: null },
            },
            letter:{
              icon: "",
              type: "code",
              position: {x: null, y: null}
            }
        },
    selectedCreatableType: null,
    selectMode: true,
    mapObjects: [[]],
    width: function(){
        return $("#width-text").val();
    },
    height: function(){
        return $("#height-text").val();
    },
    selectedMapObject: null,
    currentControl: null,
    currentControlParameters: null
};

$(function () {
    Init();
});

function Init() {
    var widthSelector = $("#width-text");
    var heightSelector = $("#height-text");
    $(widthSelector).val(Editor.defaultWidth);
    $(heightSelector).val(Editor.defaultHeight);

    var width = $(widthSelector).val();
    var height = $(heightSelector).val();

    $('#map-editor #map').on('click', 'td', function () {
        var selected = $(this);

        //if (Editor.currentControl != null) {
        //    Editor.currentControl(selected, Editor.currentControlParameters);
        //    ShowMapJson();
        //    return;
        //}

        if (Editor.selectMode) {
            $('#map-editor #map .selected').removeClass('selected')
            $(this).addClass('selected');
        }

        if (Editor.selectedCreatableType != null) {
            // placing a new object
            var x = parseInt($(this).attr('pos-x'));
            var y = parseInt($(this).attr('pos-y'));

            if (Editor.selectedCreatableType.type == 'none') {
                $(this).html('');
                Editor.mapObjects[x][y] = null;
                Editor.selectedMapObject = null;
            }
            else if (Editor.selectedCreatableType.type == "code"){
              $(this).html("C");
              var mapObject = CreateMapObjectForType(Editor.selectedCreatableType, x, y);

              Editor.mapObjects[x][y] = mapObject;
              Editor.selectedMapObject = mapObject;
              ShowJsonForSelectedPosition(mapObject);
            }else {
                $(this).html(GetIconHtml(Editor.selectedCreatableType.icon));
                var mapObject = CreateMapObjectForType(Editor.selectedCreatableType, x, y);
                Editor.mapObjects[x][y] = mapObject;
                Editor.selectedMapObject = mapObject;
                ShowJsonForSelectedPosition(mapObject);
            }

            ShowMapJson();
            //CreateControlsForSelectedPosition(Editor.selectedCreatableType.type);
        } else
        {
            // selecting an object
            var x = parseInt($(this).attr('pos-x'));
            var y = parseInt($(this).attr('pos-y'));
            var mapObject = Editor.mapObjects[x][y];
            ShowJsonForSelectedPosition(mapObject);
        }
    });

    DrawMapEditor(width, height);

    $('#controls-apply').click(function () {
        var width = $(widthSelector).val();
        var height = $(heightSelector).val();
        Editor.mapObjects = CreateMapObjectArray(width, height);
        DrawMapEditor(width, height);
    });

    $("#outer-walls").click(function(){
      AddOuterWalls();
    });

    DisplayCreatableObjectsControl();

    $('#select-mode').click(function () {
        Editor.selectMode = true;
        $(this).addClass('active');
    });

    Editor.mapObjects = CreateMapObjectArray(width, height);

    $('#position-edit-text').on('change', function() {
        var x = Editor.selectedMapObject.position.x;
        var y = Editor.selectedMapObject.position.y;
        Editor.mapObjects[x][y] = JSON.parse($(this).val());
        ShowMapJson();
    });

    $('#json-to-map').click(function() {
        JsonToMap();
    });
}

function DisplayCreatableObjectsControl() {
    var creatables = Editor.creatableObjects;
    for (var key in creatables) {
        if (!creatables.hasOwnProperty(key)) {
            return;
        }
        var gameObject = creatables[key];

        var icon = gameObject.icon;

        var iconHtml = "<i class='fa fa-fw {icon}'></i>".replace("{icon}", icon);
        var html = "<button class='btn btn-default creatable-button' icon='{icon}' type='{objectType}'>{iconHtml} {objectType}</button>"
            .replace("{icon}", icon)
            .replace("{iconHtml}", iconHtml)
            .replace("{objectType}", key)
            .replace("{objectType}", key);

        $('#creatables').append(html);

    }

    $('#creatables .creatable-button').click(function () {
        Editor.selectMode = false;
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            Editor.selectedCreatableType = Editor.creatableObjects[$(this).attr('type')];
        }
        else {
            $('#editor-controls .active').removeClass('active');
            $(this).addClass('active');
            Editor.selectedCreatableType = Editor.creatableObjects[$(this).attr('type')];
        }
    });
}

function DrawMapEditor(width, height) {
    var map = "<table>"

    for (var y = 0; y < height; y++) {
        map += "<tr>"
        for (var x = 0; x < width; x++) {
            map += "<td pos-x='{x}' pos-y='{y}'></td>".replace("{x}", x).replace("{y}", y);
        }
        map += "</tr>";
    }

    map += "</table>";

    $('#map-editor #map').html(map);
}

function GetIconHtml(icon) {

    var iconHtml = "";
    if (icon == 'exit') {
        iconHtml = "E"
    }
    if(icon == "code"){
      iconHtml = "C"
    } else {
        iconHtml = "<i class='fa fa-fw {icon}'></i>".replace("{icon}", icon);
    }

    return iconHtml;
}

function CreateMapObjectForType(createable, x, y){
    var gameObject;

    switch(createable.type) {
        case 'item':
            gameObject = new Item();
            break;
        case 'wall':
            gameObject = new Wall();
            break;
        case 'gate':
            gameObject = new Gate();
            break;
        case 'exit':
            gameObject = new Exit();
            break;
        case 'player':
          gameObject = new Player();
          break;
        case "code":
          gameObject = new Letter();
          break;
    }

    gameObject.position.x = x;
    gameObject.position.y = y;

    return gameObject;
}

function CreateMapObjectArray(width, height) {
    var mapArray = new Array(width);
     for (var x = 0; x < width; x++) {
        mapArray[x] = new Array(height);
        for (var y = 0; y < height; y++) {
              mapArray[x][y] = null;
        }
    }

    return mapArray;
}

function ShowMapJson() {
    var width = Editor.width();
    var height = Editor.height();
    var gameObjects = [];
    var gameObjectsTypes = [];
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var gameObject = Editor.mapObjects[x][y];
            if (gameObject != null) {
                gameObjects.push(gameObject);
                gameObjectsTypes.push(gameObject.type);
            }
            else{
                gameObjectsTypes.push("");
            }
        }
    }

    var outputFormat = {
        id: "",
        width: width,
        height: height,
        gameObjects: gameObjects
    }
    $('#map-output textarea').val(JSON.stringify(outputFormat, null, 4));
    $("#map-output #stringoutput").val(gameObjectsTypes.join(","))
}


function CreateControlsForSelectedPosition(objectType) {
    var createableObject = Editor.creatableObjects[objectType];
    var editForm = "";
    for (var propertyKey in createableObject) {
        if (!createableObject.hasOwnProperty(propertyKey)) {
            return;
        }

        var propertyValue = createableObject[propertyKey];


        var hasSubProperties = false;
        for (var subPropertyKey in propertyKey) {
            hasSubProperties = true;
            editForm += CreateTextField(subPropertyKey);
        }

        if (!hasSubProperties) {
            editForm += CreateTextField(propertyKey, propertyValue);
        }

    }

    $("#position-edit-form").html(editForm);
}

function ShowJsonForSelectedPosition(selectedObject) {
    $('#position-edit-text').text(JSON.stringify(selectedObject, null, 4));
}

function CreateTextField(propertyKey, propertyValue) {
   return  "<input type='text' property='" + propertyKey + "' val='" + propertyValue +"'/>";
}

function Item() {
    this.id = null;
    this.icon = 'fa-key';
    this.type = 'item';
    this.position = { x: null, y: null };
    this.color = null;
}

function Exit() {
    this.icon = 'fa-temp';
    this.type = 'exit';
    this.position = { x: null, y: null };
    this.id= null;
    this.color = null;
    this.exitToId = null;
    this.entranceId = null;
    this.exitDirection = null;
}

function Wall() {
    this.icon = 'fa-database';
    this.type = 'wall';
    this.position = { x: null, y: null };
}

function Gate() {
    this.id = null;
    this.icon = 'fa-bars';
    this.type = 'gate';
    this.position = { x: null, y: null };
    this.color = null;
    this.openedById = null;
}
function Player(){
  this.id = null;
  this.icon = 'fa-male';
  this.type = 'player';
  this.position = { x: null, y: null };
}
function Letter(){
  this.id = null;
  this.icon = "code";
  this.type = "code";
  this.position = {x: null, y: null};
}

function JsonToMap() {
    var json = $('#map-output textarea').val();
    if (json == "") {
        alert("No data to convert to the map.");
        return;
    }
    var map = JSON.parse(json);

    $("#width-text").val(map.width);
    $("#height-text").val(map.height);
    Editor.mapObjects = CreateMapObjectArray(map.width, map.height);
    DrawMapEditor(map.width, map.height);

    for (var i = 0; i < map.gameObjects.length; i++) {
        var gameObject = map.gameObjects[i];
        Editor.mapObjects[gameObject.position.x][gameObject.position.y] = gameObject;
        var selector = "#map-editor [pos-x='{x}'][pos-y='{y}']".replace("{x}", gameObject.position.x).replace("{y}", gameObject.position.y);


        if (gameObject.type == "exit") {
            var exitHtml = "E<sub>" + gameObject.id + "</sub>";
            $(selector).html(exitHtml).addClass('exit-' + gameObject.exitDirection);
        } else {
            $(selector).html(GetIconHtml(gameObject.icon));
        }
    }
}

function AddOuterWalls(){
  var width = Editor.width();
  var height = Editor.height();
  for(var i = 0; i < width; i++){
    for(var j = 0; j < height; j++){
      var x = i;
      var y = j;
      if(x == 0 || x == width - 1 || y == 0 || y == height - 1){
        var newGameObject = CreateMapObjectForType(Editor.creatableObjects.wall, x, y);
        Editor.mapObjects[newGameObject.position.x][newGameObject.position.y] = newGameObject;
        var selector = "#map-editor [pos-x='{x}'][pos-y='{y}']".replace("{x}", newGameObject.position.x).replace("{y}", newGameObject.position.y);
        $(selector).html(GetIconHtml(newGameObject.icon));
      }
    }


  }

}
