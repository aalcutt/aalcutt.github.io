function Game(options){
  this.size = options.size;
  this.actuator = options.actuator;
  this.directions = ['left', 'right', 'up', 'down'];
  this.score = 0;
  this.solver = options.solver;
  this.storageManager = options.storageManager;
 
  this.setup(options.seed);  
  this.savedGrid = this.grid.serialize();  
}

Game.prototype.newGame = function(){
  this.actuator.clearMessage();
  this.setup();
  this.savedGrid = this.grid.serialize();
}

Game.prototype.newSeededPuzzle = function(seed){
  this.seed = seed.toUpperCase();
  this.puzzleBest = this.storageManager.getPuzzlesBest(this.seed);
  this.actuator.clearMessage();
  this.setup(this.seed);
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

  if(this.over){
    this.puzzleBest = this.storageManager.getPuzzlesBest(this.seed);
    if(this.puzzleBest == null || this.score < this.puzzleBest){
      this.puzzleBest = this.score;
      this.storageManager.setPuzzlesBest(this.seed, this.score);
    }
  }

  this.actuator.actuate(this.grid, {
    score: this.score,
    over: this.over,
    won: this.won,
    puzzleBest: this.puzzleBest,
    puzzleCode: this.seed
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
