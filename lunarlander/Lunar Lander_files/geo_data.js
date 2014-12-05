
var com = com||{};
com.unitedCoders = com.unitedCoders||{};
com.unitedCoders.geo = { ll: [{"lat": 45.47550, "country": "UNITED STATES", "name": "hostip", "long": -122.81700, "city": "Beaverton, OR"}, {"lat": 41.83380, "country": "United States", "name": "geoplugin", "long": -72.57060, "city": "South Windsor"}] };
if (!("calcLL" in com.unitedCoders.geo)) {
  if (location.host.indexOf("ip-geo.appspot.com")!=-1 || location.host==='localhost:8080') {
    document.write('<script type="text/javascript" src="/geo_func.js"></script>');
  } else {
    document.write('<script type="text/javascript" src="http://ip-geo.appspot.com/geo_func.js"></script>'); 
  }
}
