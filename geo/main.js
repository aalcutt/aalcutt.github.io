$(function(){
  var updateInterval = setInterval(sendUpdate, 5000);
  var geolocationInterval = setInterval(getLocation, 1000);
  var currentCoords = null;
  var game = new Game();

  function getLocation(){
    navigator.geolocation.getCurrentPosition(function(position){
      currentCoords = position.coords;
    });
  }

  function sendUpdate(){
    if(!currentCoords){
      return;
    }

    var data = {
      coords: {
        latitude: currentCoords.latitude,
        longitude: currentCoords.longitude
      }
    }
    game.checkLocation(data.coords);
    console.log(game.distanceTraveled);
    $(".wrapper").html(game.distanceTraveled);
  }

  window.testMove = function(){
    clearInterval(geolocationInterval);
    currentCoords = {
      latitude: currentCoords.latitude + .001,
      longitude: currentCoords.longitude + .001,
    }
  }
});
