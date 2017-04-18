var width = 4;
var height = 4;
/*var board = [
    [1,1,1,1],
    [1,1,1,1],
    [1,1,1,1],
    [1,1,1,1]
];*/

var coordinatesToChange = [
    [-1, 0], // left
    [0, -1], // up
    [0, 1], // down
    [1, 0], // right
]

var maxColor = 3;
var colorCodes = {
    "1": "#0000ff",
    "2": "#ff0000",
    "3": "#00ff00"    
}

$("td").on("click", function(){
    var x = parseInt($(this).data("x"));
    var y = parseInt($(this).data("y"));
    updateBoard(x, y);
});

$(".levels li").on("click", function(){
    var level = $(this).text();
    loadGame(level);
});

function updateBoard(x, y){
    var currentColorCode = $(`td[data-x='${x}'][data-y='${y}']`).data("color");
    var colorCode = parseInt(currentColorCode);
    colorCode = getNextColorCode(colorCode);
    
    updateColor(x, y, colorCode);
    var winning = true;
    for(var i = 0; i < coordinatesToChange.length; i++){
        var otherX = x + coordinatesToChange[i][0];
        var otherY = y + coordinatesToChange[i][1];
        var exists = $(`td[data-x='${otherX}'][data-y='${otherY}']`);
        if(exists.length > 0){
            currentColorCode = exists.data("color");
            colorCode = getNextColorCode(currentColorCode);
            updateColor(otherX, otherY, colorCode);
            if(colorCode != 3){
                winning = false;
            }
        }
    }

    if(winning){

    }
}

function getNextColorCode(colorCode){
    var nextColorCode = colorCode + 1;
    if(nextColorCode > maxColor){
        nextColorCode = 1;
    }

    return nextColorCode;
}

function updateColor(x, y, colorCode){
    var color = colorCodes[colorCode];
    $(`td[data-x='${x}'][data-y='${y}']`).css("background-color", color).data("color", colorCode);
}

function loadGame(level){
    var board = levels[level];
    for(var x = 1; x <= width; x++){
        for(var y = 1; y <= height; y++){
            var colorCode = board[x-1][y-1];
            var color = colorCodes[colorCode];
            $(`td[data-x='${x}'][data-y='${y}']`).css("background-color", color).data("color", colorCode);
        }
    }
}

var currentLevel = 1;
var numberLevels = 3;

function displayNextLevel(){
    currentLevel++;
    loadGame();
}

$(function(){
    loadGame(1);
})




var levels = {
    "1":  [
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1],
        [1,1,1,1]
    ],
    "2": [
        [2,2,3,2],
        [2,3,2,3],
        [3,2,3,2],
        [2,3,2,2]
    ],
    "3": [
        [2,3,1,1],
        [3,2,3,1],
        [1,3,2,3],
        [1,1,3,2]
    ],
     "4": [
        [1,2,2,1],
        [2,3,1,2],
        [3,3,3,1],
        [4,3,1,3]
    ],
     "5": [
        [1,3,3,1],
        [3,1,1,3],
        [3,1,1,3],
        [1,3,3,1]
    ],
     "6": [
        [1,2,2,1],
        [2,1,1,2],
        [2,1,1,2],
        [1,2,2,1]
    ],
     "7": [
        [2,1,1,1],
        [1,3,2,1],
        [1,2,3,1],
        [1,1,1,2]
    ],
}