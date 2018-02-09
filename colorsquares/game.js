(function(){
    var width = 4;
    var height = 4;
    var currentLevel = 1;
    var numberLevels = 3;
    var levels_cleared = [];
    var puzzle_solved = false;

    var coordinatesToChange = [
        [-1, 0], // left
        [0, -1], // up
        [0, 1], // down
        [1, 0], // right
    ];
    
    var colorCodes = {
        "1": "#E15554",
        "2": "#4D9DE0",
        "3": "#3BB273",
        "4": "#CDC8E1"
    };

    var colorPatterns = {
        "1": "2",
        "2": "3",
        "3": "1"
    }

     $(function(){
        loadGame(1);
    })   

    $("td").on("click", function(){
        if(!puzzle_solved){
            var x = parseInt($(this).data("x"));
            var y = parseInt($(this).data("y"));
            updateBoard(x, y);
        }  
    });

    $(".levels li").on("click", function(){
        var level = $(this).text();
        loadGame(level);
    });

    $(".winner-overlay").on("click", function(){
        displayNextLevel();
    });


    function updateBoard(x, y){
        var currentColorCode = $(`td[data-x='${x}'][data-y='${y}']`).data("color");
        if(currentColorCode == 4){
            return;
        }
        var colorCode = parseInt(currentColorCode);
        colorCode = getNextColorCode(colorCode);
        
        updateColor(x, y, colorCode);
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

        checkWinner();
    }

    function checkWinner(){
        var solved = true;
        var blocks = $("table td")
        $.each(blocks, function(){
            var colorCode = $(this).data("color");
            if(colorCode != 3 && colorCode != 4){
                solved = false;
            }
        });

        if(solved){
            puzzle_solved = true;
            showWinner();
        }
    }

    function getNextColorCode(colorCode){
        return colorPatterns[colorCode];
    }

    function updateColor(x, y, colorCode){
        var color = colorCodes[colorCode];
        $(`td[data-x='${x}'][data-y='${y}']`).css("background-color", color).data("color", colorCode);
    }

    window.loadGame = function(level){
        var board = levels[level];
        for(var x = 1; x <= width; x++){
            for(var y = 1; y <= height; y++){
                var colorCode = board[x-1][y-1];
                var color = colorCodes[colorCode];
                $(`td[data-x='${x}'][data-y='${y}']`).css("background-color", color).data("color", colorCode);
            }
        }
    }
    function displayNextLevel(){
        currentLevel++;
        puzzle_solved = false
        $(".winner-overlay").hide();
        $(".levels ul").append($("<li>").text(currentLevel));
        loadGame(currentLevel);
    }

    function showWinner(){
        $(".winner-overlay").show();        
    }

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
        "8": [
            [2,1,1,1],
            [3,2,1,3],
            [2,1,1,2],
            [3,3,3,3]
        ],
        "9":  [
            [1,1,1,1],
            [1,4,1,1],
            [1,1,4,1],
            [1,1,1,1]
        ],
         "10":  [
            [1,4,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,4,1]
        ]
    }

})();