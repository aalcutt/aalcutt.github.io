$(function(){
  var playing = false;
  
  $("body").on("touchstart", function(){
	if ("vibrate" in navigator) {
		navigator.vibrate(1000);
	}
	else{
		alert("no support");
	}
  })
});
