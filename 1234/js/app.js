var g;
var solver;
var d = new Date();
var puzzleSeed = todaysSeed = d.getDay() + "-" + d.getDate() + "-" + d.getFullYear();
var puzzleHash = window.location.hash;
var hashSeed = puzzleHash != "" && puzzleHash != "#" ? puzzleHash.replace("#","") : null;
$(function(){
 
  setSeedOnHash();
  g = new Game({size: 8, seed: puzzleSeed, actuator: new HTMLActuator(), storageManager: new StorageManager()});
  g.newSeededPuzzle(puzzleSeed);
  $('.tile-container').on('click', '.tile', function(){
    var x = $(this).attr('x');
    var y = $(this).attr('y');
    var tile = g.grid.cells[x][y];
    g.moveTile(tile);
  });

  $('.randompuzzle-button').click(function(){
    $('.above-game .randompuzzle-button').addClass('active').addClass('btn-primary');
    $('.todayspuzzle-button').removeClass('active').removeClass('btn-primary')
    Math.seedrandom();
    puzzleSeed = randomString(10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    g.newSeededPuzzle(puzzleSeed);
    window.location.hash = puzzleSeed;
  });


  $('.tryagain-button').click(function(){
    g.restart();
  });

  $('.todayspuzzle-button').click(function(){
    window.location.hash = "";
    g.newSeededPuzzle(todaysSeed);
    $(this).addClass('active').addClass('btn-primary');
    $('.randompuzzle-button').removeClass('active').removeClass('btn-primary')
  });

  $(".game-message .share .puzzle-link").focus(function() { $(this).select(); } );

});

$(window).on('hashchange', function() {
  setSeedOnHash();
  g.newSeededPuzzle(puzzleSeed);
});

function setSeedOnHash(){
  hash = window.location.hash;
  hashSeed = hash != "" && hash != "#" ? hash.replace("#","") : null;
  if(hashSeed && hashSeed != todaysSeed){
    puzzleSeed = hashSeed;
    $('.todayspuzzle-button').removeClass('active').removeClass('btn-primary')
    $('.above-game .randompuzzle-button').addClass('active').addClass('btn-primary');
  }
  else{
    puzzleSeed = todaysSeed;
    $('.todayspuzzle-button').addClass('active').addClass('btn-primary');
    $('.above-game .randompuzzle-button').removeClass('active').removeClass('btn-primary')
  }
}


function Solve(){
  var solver = new Solver(g);
  //var level = levels[5]
  //g = new Game({puzzleMode: true, size: level.size, level: level, actuator: new HTMLActuator({puzzleMode: true, level: level})});
  //g.setupLevel(level)
  var solved = solver.solve(g, {maxScore: 0, moves: []});
  console.log("max for this grid: " + solved.maxScore);
  console.log(solved)

  console.log("max on board: " + solver.maxOnBoard(g))
}

function GetQueryStringParams(sParam)
{
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)
  {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam)
      {
          return sParameterName[1];
      }
  }
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}