function HTMLActuator(options){
  options = options || {}
  this.tileContainer = $('.tile-container');
  this.scoreContainer = $('.score-container');
  this.messageContainer = $(".game-message");
  this.nextLevelContainer = $('.next-level');
  this.targetScoreContainer = $(".target-score-container")
  this.score = 0;

  if(options.puzzleMode){

    this.targetScore = options.level.targetScore;

  }

}

HTMLActuator.prototype.actuate = function(grid, meta){
  var self = this;

  window.requestAnimationFrame(function(){
    self.clearContainer(self.tileContainer);

    var s = "<table>";

    for(var x = 0; x < grid.size; x++){
        s += "<tr>"
      for(var y = 0; y < grid.size; y++){
        var cell = grid.cells[x][y];
        if(cell){
          s += "<td class='tile' x='{x}' y='{y}'>{0}{1}</td>"
            .replace("{0}", cell.value)
            .replace("{1}", self.getArrow(cell.direction))
            .replace("{x}", cell.x).replace("{y}", cell.y)
        }
        else{
          s += "<td class='empty'></td>"
        }

      }
      s += "</tr>"
    }
    s += "</table>"
    self.tileContainer.append(s);
  });

  self.updateScore(meta.score, meta.targetScore);

  if(meta.over){
    if(meta.puzzleMode){
      if(meta.won)
      {
        self.nextLevelContainer.show();
        self.message(true)
      }
      else{
        self.message(false)
      }
    }
    else{
        self.score = meta.score;
        self.maxScore = meta.maxScore;
        if(self.score == self.maxScore){
          self.message(true);
        }
        else{
          self.message(false);
        }
    }
  }
}

HTMLActuator.prototype.clearContainer = function (container) {
  container.html("");
};

HTMLActuator.prototype.getArrow = function(direction){
  if(direction == "up"){
    return "<span class='up-arrow'>&uarr;</span>";
  }
  if(direction == "down"){
    return "<span class='down-arrow'>&darr;</span>";
  }
  if(direction == "left"){
    return "<span class='left-arrow'>&larr;</span>";
  }
  if(direction == "right"){
    return "<span class='right-arrow'>&rarr;</span>";
  }
}

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  inner.textContent = tile.value;
  wrapper.appendChild(inner);
  // Put the tile on the board
  this.tileContainer.append(wrapper);
}

HTMLActuator.prototype.updateScore = function(score, targetScore){
  this.clearContainer(this.scoreContainer);
  this.score = score;
  this.scoreContainer.text(score);

  if(targetScore){

    this.targetScore = targetScore;
    this.clearContainer(this.targetScoreContainer)
    this.targetScoreContainer.text(targetScore);
    this.targetScoreContainer.css('display', 'inline-block');
  }
}

HTMLActuator.prototype.message = function(won){
  var type = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";
  this.messageContainer.addClass(type);
  //this.messageContainer.find('p').text(message);
  this.messageContainer.find('.score').html("Your score: <strong> " + this.score + "</strong>");
  //this.messageContainer.find('.max-score').html("Max score for puzzle: <strong> " + this.maxScore + "</strong>");
}

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.removeClass("game-won");
  this.messageContainer.removeClass("game-over");
};

HTMLActuator.prototype.clearNextlevel = function(){
  this.nextLevelContainer.hide();
}
