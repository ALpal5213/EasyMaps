var lat;
var lon;

function getLocation() {
  	navigator.geolocation.getCurrentPosition(getPosition);
  	console.log("1")
}

function getPosition(position) {
	lat = position.coords.latitude;
  	lon = position.coords.longitude;
}