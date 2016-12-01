function HTMLActuator(options){
  options = options || {}
  this.tileContainer = $('.tile-container');
  this.scoreContainer = $('.score-container');
  this.messageContainer = $(".game-message");
  this.nextLevelContainer = $('.next-level');
  this.targetScoreContainer = $(".target-score-container")
  this.shareContainer = $(".game-message .share")
  this.score = 0;
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
          s += "<td class='tile value-{0}' x='{x}' y='{y}'>{1}</td>"
            .replace("{0}", cell.value)
            .replace("{1}", self.getArrow(cell.direction, cell.value))
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

  self.updateScore(meta.score, meta.puzzleBest);

  if(meta.over){
    self.puzzleCode = meta.puzzleCode;
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

HTMLActuator.prototype.clearContainer = function (container) {
  container.html("");
};

HTMLActuator.prototype.getArrow = function(direction, value){
  var arrowString = "";
  for(var arrows = 0; arrows < value; arrows++){
    if(direction == "up"){
      arrowString += arrows > 0 ? "<br />" : "";
      arrowString += "<i class='fa fa-chevron-up' aria-hidden='true'></i>";
    }
    if(direction == "down"){
      arrowString += arrows > 0 ? "<br />" : "";
      arrowString +=  "<i class='fa fa-chevron-down' aria-hidden='true'></i>";
    }
    if(direction == "left"){
      arrowString +=  "<i class='fa fa-chevron-left' aria-hidden='true'></i>";
    }
    if(direction == "right"){
      arrowString +=  "<i class='fa fa-chevron-right' aria-hidden='true'></i>";
    }
  }
  return arrowString;
}

HTMLActuator.prototype.updateScore = function(score, puzzleBest){
  this.clearContainer(this.scoreContainer);
  this.score = score;
  this.scoreContainer.text("Total: " + score);
  this.puzzleBest = puzzleBest != null ? puzzleBest : "NA";
  $('.best-score-container').text("Lowest: " + this.puzzleBest);
}

HTMLActuator.prototype.message = function(won){
  var type = won ? "game-won" : "game-over";

  this.messageContainer.addClass(type);
  this.messageContainer.find('p').text("Fin");
  this.messageContainer.find('.score').html("Your total: <strong> " + this.score + "</strong>");

  var shareLink = location.protocol+'//'+location.host+location.pathname + "#" + this.puzzleCode;
  this.shareContainer.find('.puzzle-link').val(shareLink)
}

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.removeClass("game-won");
  this.messageContainer.removeClass("game-over");
};

HTMLActuator.prototype.clearNextlevel = function(){
  this.nextLevelContainer.hide();
}
