function Solver(){
}

Solver.prototype.solve = function(game, solved){
  //var savedMoves = solved.moves;
  var moves = [];
  var maxScore = solved.maxScore;
  var gameClone = new Game({size: game.size, actuator: new NullActuator()})
  gameClone.score = game.score;
  gameClone.grid.cells = gameClone.grid.fromState(game.grid.serialize().cells);
  //gameClone = this.getFreePoints(gameClone);
  var tiles = gameClone.grid.remainingTiles();
  if(tiles.length == 0){
    console.log(gameClone.score);
    return {maxScore: maxScore, moves: []};
  }

  /*
  if(tiles.length == 1){
    moves.push(tiles[0].x + "," + tiles[0].y)
    return {maxScore: gameClone.score + tiles[0].value, moves: moves};
  }*/

  /*
  var maxOnBoardBeforeMoves = this.maxOnBoard(gameClone);
  if(maxOnBoardBeforeMoves + gameClone.score <= maxScore){
    return maxOnBoardBeforeMoves + gameClone.score;
  }*/



  for(var i = 0; i < tiles.length; i++){
    var maxOnBoard = this.maxOnBoard(gameClone);
    if(maxOnBoard + gameClone.score <= maxScore){
      console.log("max out of every play: " + (maxOnBoard + gameClone.score))
      break;
    }

    var savedCellState = gameClone.grid.serialize().cells;
    var savedScore = gameClone.score;
    var savedMoves = moves;
    var tile = tiles[i];
    gameClone.moveTile(tile);

    if(gameClone.over){
      if(gameClone.score > maxScore){
        moves.push(tile.x + "," + tile.y);
        maxScore = gameClone.score;
      }
      else{
        gameClone.score = savedScore;
        gameClone.grid.cells = gameClone.grid.fromState(savedCellState);
      }


      //moves = savedMoves;
      continue;
    }

    var maxOnBoardAfterMove = this.maxOnBoard(gameClone);
    if(maxOnBoardAfterMove + gameClone.score <= maxScore){
      console.log("Current Max: " + maxScore + " Max in path:" + (maxOnBoardAfterMove + gameClone.score));
      gameClone.score = savedScore;
      gameClone.grid.cells = gameClone.grid.fromState(savedCellState);
      //moves = savedMoves;
    }
    else{
      moves.push(tile.x + "," + tile.y);
      var newSolved = this.solve(gameClone, {maxScore: maxScore, moves: moves});

      if(newSolved.maxScore > maxScore){
        moves = newSolved.moves;
        maxScore = newSolved.maxScore;
      }
      else{
        moves = savedMoves;
        gameClone.score = savedScore;
        gameClone.grid.cells = gameClone.grid.fromState(savedCellState);
      }
    }
  }

  return {maxScore: maxScore, moves: moves};
}

Solver.prototype.maxOnBoard = function(game){
  var tiles = game.grid.remainingTiles();
  var max = 0;
  for(var i = 0; i < tiles.length; i++){
    max += tiles[i].value;
  }

  return max;
}

Solver.prototype.getFreePoints = function(game){
  var tiles = game.grid.remainingTiles();
  for(var i = 0; i < tiles.length; i++){
    var tile = tiles[i];
    switch(tile.direction){
      case "left":
        if(tile.y == 0)
          game.moveTile(tile);
        else{
          var blocker = false;
          for(var v = 0; v < tile.value; v++){
            if(tile.y - v >= 0){
              blocker = game.grid.cells[tile.x][v] != null;
            }
          }

          if(!blocker){
            console.log("free left point")
            game.moveTile(tile);
          }
        }

      break;
      case "right":
        if(tile.y == game.size - 1)
          game.moveTile(tile);
        else{
          var blocker = false;
          for(var v = 0; v < tile.value; v++){
            if(tile.y + v <= game.grid.size - 1){
              blocker = game.grid.cells[tile.x][v] != null;
            }
          }

          if(!blocker){
            console.log("free right point")
            game.moveTile(tile);
          }
        }
      break;
      case "up":
        if(tile.x == 0)
          game.moveTile(tile);
        else{
            var blocker = false;
            for(var v = 0; v < tile.value; v++){
              if(tile.y - v >= 0){
                blocker = game.grid.cells[v][tile.y] != null;
              }
            }

            if(!blocker){
              console.log("free up point")
              game.moveTile(tile);
            }
          }
      break;
      case "down":
        if(tile.x == game.size - 1)
          game.moveTile(tile);
        else{
            var blocker = false;
            for(var v = 0; v < tile.value; v++){
              if(tile.x + v <= game.grid.size - 1){
                blocker = game.grid.cells[v][tile.y] != null;
              }
            }

            if(!blocker){
              console.log("free down point")
              game.moveTile(tile);
            }
          }
        break;
    }
  }

  return game;
}
