function Tile(position, value, direction) {
  this.position = position;
  this.x                = position.x;
  this.y                = position.y;
  this.value            = value;

  this.previousPosition = null;
  this.direction = direction;
}

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.serialize = function () {
  return {
    position: {
      x: this.x,
      y: this.y
    },
    value: this.value,
    direction: this.direction
  };
};
