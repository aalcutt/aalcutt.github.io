$(function(){
  var g = new Game({size: 8, actuator: new HTMLActuator()})
  $('.tile-container').on('click', '.tile', function(){
    var x = $(this).attr('x');
    var y = $(this).attr('y');
    var tile = g.grid.cells[x][y];
    g.moveTile(tile);
  });

  $('.restart-button').click(function(){
    g.restart();
  });
})
