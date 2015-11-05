function Game(options){
  this.size = options.size;
  this.actuator = options.actuator;
  this.directions = ['left', 'right', 'up', 'down'];
  this.score = 0;
  this.solver = options.solver;
  this.setup();
  this.savedGrid = this.grid.serialize();
}

Game.prototype.newGame = function(){
  this.actuator.clearMessage();
  this.setup();
  this.savedGrid = this.grid.serialize();
}

Game.prototype.newSeededPuzzle = function(seed){
  this.actuator.clearMessage();
  this.setup(seed);
  this.savedGrid = this.grid.serialize();
}

Game.prototype.restart = function(){
  this.actuator.clearMessage();
  this.setup();
  this.grid.cells = this.grid.fromState(this.savedGrid.cells);
}
Game.prototype.setup = function(seed){
  if(seed){
    Math.seedrandom(seed);
  }
  else{
    Math.seedrandom();
  }
  this.score = 0;
  this.grid = new Grid(this.size);
  this.addStartTiles();
  this.actuate();
}

Game.prototype.setupLevel = function(level){
  this.actuator.clearMessage();
  this.actuator.clearNextlevel();
  this.level = level;
  this.score = 0;
  this.targetScore = level.targetScore;
  this.grid = new Grid(level.size);
  this.parseLevel(level.size, level.levelData);
  this.actuate();
}

Game.prototype.addStartTiles = function(){
  for(var x = 0; x < this.size; x++){
    this.grid.cells[x] = new Array(this.size);
    for(var y = 0; y < this.size; y++){
      this.grid.cells[x][y] = this.randomTile(x, y);
    }
  }
}

Game.prototype.randomTile = function(x, y){

  var v = Math.floor((Math.random() * 4) + 1);
  var rD = Math.floor((Math.random() * 4));
  var direction = this.directions[rD];
  return new Tile({x:x, y:y}, v, direction);
}

Game.prototype.actuate = function(){
  var hasTiles = false;
  for(var x = 0; x < this.grid.size; x++){
    for(var y = 0; y < this.grid.size; y++){
      hasTiles = this.grid.cells[x][y] != null ? true : hasTiles;
    }
  }

  this.over = !hasTiles;

  if(this.puzzleMode){
    if(this.over && this.score >= this.targetScore){
      this.won = true;
    }
    else if(this.over && this.score < this.targetScore){
      this.won = false;
    }
  }

  this.actuator.actuate(this.grid, {
    score: this.score,
    over: this.over,
    won: this.won,
    puzzleMode: this.puzzleMode,
    targetScore: this.targetScore,
    maxScore: this.maxScore
  });
}

Game.prototype.moveTile = function(tile){
  var self = this;
  var x = 0;
  var y = 0;

  self.grid.cells[tile.x][tile.y] = null;
  this.score += tile.value;
  for(var i = 0; i <= tile.value; i++){
    if(tile.direction == "left"){
      y = tile.y - i;
      x = tile.x;
      if(y < 0){
        continue;
      }
    }
    if(tile.direction == "right"){
      y = tile.y + i;
      x = tile.x;
      if(y > self.grid.size -1){
        continue;
      }
    }
    if(tile.direction == "up"){
      y = tile.y;
      x = tile.x - i;
      if(x < 0){
        continue;
      }
    }
    if(tile.direction == "down"){
      y = tile.y;
      x = tile.x + i;
      if(x > self.grid.size -1){
        continue;
      }
    }
    self.grid.cells[x][y] = null;
  }

  this.actuate();
}

Game.prototype.parseLevel = function(size, levelData){
  for(var x = 0; x < size; x++){
    for(var y = 0; y < size; y++){
      var split = levelData[x][y].split("");
      var v = parseInt(split[0]);
      var d = split[1];
      if(d == "d")
        d = "down"
      if(d == "u")
        d = "up"
      if(d == "l")
        d = "left"
      if(d == "r")
        d = "right"

      var tile = new Tile({x: x, y: y}, v, d);
      this.grid.cells[x][y] = tile;
    }
  }
}
