function Solver(){
}

Solver.prototype.solve = function(game, maxScore){
  var gameClone = new Game({size: game.size, actuator: new NullActuator()})
  gameClone.score = game.score;
  gameClone.grid.cells = $.extend(true, {}, game.grid.cells);
  var tiles = gameClone.grid.remainingTiles();
  if(tiles.length == 0){
    return gameClone.score;
  }

  for(var i = 0; i < tiles.length; i++){
    var tile = tiles[i];
    var savedScore = gameClone.score;
    gameClone.moveTile(tile);

    if(this.maxOnBoard(gameClone) + gameClone.score < maxScore){
      continue;
    }

    var solvedScore = this.solve(gameClone, maxScore);
    gameClone.score = savedScore;
    maxScore = solvedScore > maxScore ? solvedScore : maxScore;
  }

  return maxScore;
}

Solver.prototype.maxOnBoard = function(game){
  var tiles = game.grid.remainingTiles();
  var max = 0;
  for(var i = 0; i < tiles.length; i++){
    max += tiles[i].value;
  }

  return max;
}
