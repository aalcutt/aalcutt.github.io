var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

function PuzzleGame(options){
  this.size = options.size;
  this.actuator = options.actuator;
  this.directions = ['left', 'right', 'up', 'down'];
  this.score = 0;
  this.targetScore = options.level.targetScore;

  this.setup(options.level);
}

inheritsFrom(PuzzleGame, Game);

PuzzleGame.prototype.setup =  function(level){
  this.score = 0;
  this.targetScore = level.targetScore;
  this.grid = new Grid(this.size);
  this.parseLevel(level.size, level.levelData);
  this.actuate();
}

Game.prototype.actuate = function(){
  var hasTiles = false;
  for(var x = 0; x < this.grid.size; x++){
    for(var y = 0; y < this.grid.size; y++){
      hasTiles = this.grid.cells[x][y] != null ? true : hasTiles;
    }
  }

  this.over = !hasTiles;

  this.actuator.actuate(this.grid, {
    score: this.score,
    over: this.over,
    targetScore: this.targetScore
  });
}
