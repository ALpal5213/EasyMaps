/*
Author: Adrian J. Lewis
Date: 18 Sept 2022
JavaScript used to calculate distance
*/
var lat;
var lon;
var update = 1;

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

	/*conversion ratio for degrees -> radians*/
	var con = Math.PI / 180.0;

	/*Send distance to html*/
	var distance = calcDistance(clat, clon, dlat, dlon, con);
	document.getElementById("distance").innerHTML = distance[0] + " km";

	/*Send directions to html*/
	var direction = calcDirection(clon - dlon, clat - dlat, distance[1], con);
	document.getElementById("direction").innerHTML = direction + "\u00B0";

	if (update == 1) {
		update = 0;
		setTimeout(deviceLocation, 5000);
	}
}

/*Determine distance to travel*/
function calcDistance(clat, clon, dlat, dlon, con) {
	var R = 6371; /*Average Earth radius in km*/

	/*Angles for calculation converted to radians*/
	var a = (90.0 - dlat) * con;
	var c = (90.0 - clat) * con;
	var B = (clon - dlon) * con;
	var b;

	b = Math.acos(Math.cos(a) * Math.cos(c) + 
				  Math.sin(a) * Math.sin(c) * Math.cos(B))

	var distance = R * b;

	return [distance.toFixed(2), b];
}

/*Determine the direction of travel*/
function calcDirection(B, X, b, con) {
	var A0;
	var A;

	A0 = Math.asin(Math.sin(Math.abs(B) * con) / Math.sin(b)) / con;

	if (B < 0 && X < 0) {
		A = A0;
	} else if (B > 0 && X < 0) {
		A = 360 - A0;
	} else if (B < 0 && X > 0) {
		A = 180 - A0;
	} else {
		A = 180 + A0;
	}

	return A.toFixed(2);
}

function deviceLocation() {
  	navigator.geolocation.getCurrentPosition(getPosition);
  	if (update == 0) {
  		setTimeout(map, 0);
  	}
  	update = 1;
}

function getPosition(position) {
	document.getElementById("clat").value = position.coords.latitude;
  	document.getElementById("clon").value = position.coords.longitude;
}