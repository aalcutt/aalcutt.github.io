function HTMLActuator(){
  this.tileContainer = $('.tile-container');
  this.scoreContainer = $('.score-container');
  this.messageContainer = $(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function(grid, meta){
  var self = this;

  window.requestAnimationFrame(function(){
    self.clearContainer(self.tileContainer);

    var s = "<table>";

    for(var y = 0; y < grid.size; y++){
        s += "<tr>"
      for(var x = 0; x < grid.size; x++){
        var cell = grid.cells[x][y];
        if(cell){
          s += "<td class='tile' x='{x}' y='{y}'>{0}{1}</td>"
            .replace("{0}", cell.value)
            .replace("{1}", self.getArrow(cell.direction))
            //.replace("{3}", self.getArrowClass(cell.direction))
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

  self.updateScore(meta.score);

  if(meta.over){
    self.message(false);
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

HTMLActuator.prototype.updateScore = function(score){
  this.clearContainer(this.scoreContainer);
  this.score = score;

  this.scoreContainer.text(score);
}

HTMLActuator.prototype.message = function(won){
  var type = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";
  this.messageContainer.addClass(type);
  this.messageContainer.find('p').text(message);
}

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.removeClass("game-won");
  this.messageContainer.removeClass("game-over");
};
