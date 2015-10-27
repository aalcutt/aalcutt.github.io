function Game(options){
  this.size = options.size;
  this.actuator = options.actuator;
  this.directions = ['left', 'right', 'up', 'down'];
  this.setup();
  this.score = 0;
}

Game.prototype.restart = function(){
  this.actuator.clearMessage();
  this.setup();
}
Game.prototype.setup = function(){
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

  this.actuator.actuate(this.grid, {
    score: this.score,
    over: this.over
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
      x = tile.x - i;
      y = tile.y;
      if(x < 0){
        continue;
      }
    }
    if(tile.direction == "right"){
      x = tile.x + i;
      y = tile.y;
      if(x > self.grid.size -1){
        continue;
      }
    }
    if(tile.direction == "up"){
      x = tile.x;
      y = tile.y - i;
      if(y < 0){
        continue;
      }
    }
    if(tile.direction == "down"){
      x = tile.x;
      y = tile.y + i;
      if(y > self.grid.size -1){
        continue;
      }
    }
    self.grid.cells[x][y] = null;
  }

  this.actuate();
}
