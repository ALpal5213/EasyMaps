/*
Author: Adrian J. Lewis
Date: 18 Sept 2022
JavaScript used to calculate distance
*/
var lat;
var lon;
var update;

function reset() {
	document.location.reload(true);
}

function map() {
	/*Get input data from webpage, c prefix stands for current, 
	d prefix stands for destination*/
	var clat = document.getElementById("clat").value;
	var clon = document.getElementById("clon").value;
	var dlat = document.getElementById("dlat").value;
	var dlon = document.getElementById("dlon").value;

	/*conversion ratio between degrees <-> radians*/
	var convert = Math.PI / 180.0;

	/*Angles for calculations converted to radians*/
	var a = (90.0 - dlat) * convert;
	var c = (90.0 - clat) * convert;
	var B = (clon - dlon) * convert;
	var X = (clat - dlat) * convert;

	/*Send distance to html*/
	var distance = calcDistance(a, c, B);
	document.getElementById("distance").innerHTML = distance[0] + " km";

	/*Send directions to html*/
	var direction = calcDirection(B, X, a, distance[1], convert);
	document.getElementById("direction").innerHTML = direction + "\u00B0";

	if (update == 0) {
		update = 1;
		setTimeout(deviceLocation, 5000);
	}
}

/*Determine distance to travel*/
function calcDistance(a, c, B) {
	var R = 6371; /*Average Earth radius in km*/
	var b;

	b = Math.acos(Math.cos(a) * Math.cos(c) + 
				  Math.sin(a) * Math.sin(c) * Math.cos(B))

	var distance = R * b;

	return [distance.toFixed(2), b];
}

/*Determine the direction of travel*/
function calcDirection(B, X, a, b, convert) {
	var A0;
	var A;

	A0 = Math.asin(Math.sin(Math.abs(B)) * Math.sin(a) / Math.sin(b)) / convert;

	
	if (B <= 0 && X <= 0) {       /*if destination is east and north*/
		A = A0;
	} else if (B > 0 && X <= 0) { /*if destination is west and north*/
		A = 360.0 - A0;
	} else if (B < 0 && X > 0) {  /*if destination is east and south*/
		A = 180.0 - A0;
	} else if (B >= 0 && X > 0) { /*if destination is west and south*/
		A = 180.0 + A0;
	} else {
		A = A0;
		console.log("error")      /*Should not go here*/
	}
	
	return A.toFixed(2);
}

function deviceLocation() {
  	navigator.geolocation.getCurrentPosition(getPosition);
  	if (update == 1) {
  		setTimeout(map, 0);
  	}
  	update = 0;
}

function getPosition(position) {
	document.getElementById("clat").value = position.coords.latitude;
  	document.getElementById("clon").value = position.coords.longitude;
}