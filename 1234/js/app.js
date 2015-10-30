var g;
var solver;
$(function(){
  g = new Game({size: 8, actuator: new HTMLActuator()});

  $('.tile-container').on('click', '.tile', function(){
    var x = $(this).attr('x');
    var y = $(this).attr('y');
    var tile = g.grid.cells[x][y];
    g.moveTile(tile);
  });

  $('.restart-button').click(function(){
    g.restart();
  });

  $('.puzzle-mode').click(function(){
    var level = levels[currentLevel];
    g = new Game({puzzleMode: true, size: level.size, level: level, actuator: new HTMLActuator({puzzleMode: true, level: level})});
  });

  $('.next-level').click(function(){
    currentLevel++;
    var level = levels[currentLevel];
    g.setupLevel(level);
  });


});

var currentLevel = 1;

var levelData = [
  null, // just to shift the levels to be consistent
  [
    ["1r", "1d", "2u"],
    ["1u", "2l", "2d"],
    ["2d", "1u", "3l"]
  ],
  [
    ["2r", "1d", "2d"],
    ["1u", "1d", "2l"],
    ["1r", "1u", "2u"]
  ],
  [
    ["1r", "1d", "1d"],
    ["1r", "1d", "1r"],
    ["1r", "1r", "1u"]
  ],
  [
    ["2r", "2d", "2l"],
    ["2d", "2d", "2u"],
    ["2u", "2r", "2l"]
  ],
  [
    ["2r", "2u", "2l", "3d"],
    ["2d", "1d", "2u", "1r"],
    ["1r", "2u", "2l", "2l"],
    ["3u", "3r", "1d", "2l"]
  ],
  [
    ["1r","2l"],
    ["1r", "2l"]
  ]
];

var levels = {
  1: {size: 3, targetScore: 8, levelData: levelData[1]},
  2: {size: 3, targetScore: 10, levelData: levelData[2]},
  3: {size: 3, targetScore: 9, levelData: levelData[3]},
  4: {size: 3, targetScore: 12, levelData: levelData[4]},
  5: {size: 4, targetScore: 17, levelData: levelData[5]},
  6: {size: 2, targetScore: 2, levelData: levelData[6]}
}

function LoadLevel(n){
  currentLevel = n;
  var level = levels[n];
  g.setupLevel(level);
}

function Solve(){
  var solver = new Solver(g);
  //var level = levels[5]
  //g = new Game({puzzleMode: true, size: level.size, level: level, actuator: new HTMLActuator({puzzleMode: true, level: level})});
  //g.setupLevel(level)
  var solved = solver.solve(g, {maxScore: 0, moves: []});
  console.log("max for this grid: " + solved.maxScore);
  console.log(solved)

  console.log("max on board: " + solver.maxOnBoard(g))
}
