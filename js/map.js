/*
Author: Adrian J. Lewis
Date: 30 Sept 2022
JavaScript used to calculate distance, 
direction, receive device location, and 
reset the website
*/

var lat;
var lon;
var update;

/*Reset webpage*/
function reset() {
	document.location.reload(true);
}

/*Determine distance and direction from user input*/
function map() {
	/*Get input data from webpage, c prefix stands for current, 
	d prefix stands for destination*/
	var clat = document.getElementById("clat").value;
	var clon = document.getElementById("clon").value;
	var dlat = document.getElementById("dlat").value;
	var dlon = document.getElementById("dlon").value;

	/*conversion ratio between degrees and radians*/
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

	/*Ask for device location every 5 seconds only
	if the user selected device location for input*/
	if (update == 0) {
		update = 1;
		setTimeout(deviceLocation, 1000);
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

	/*Calculate A0 and turn into degrees*/
	A0 = Math.asin(Math.sin(Math.abs(B)) * Math.sin(a) / Math.sin(b)) / convert;

	/*Determine by "inspection" direction of A*/
	if (B <= 0 && X <= 0) {       /*if destination is east and north*/
		A = A0;
	} else if (B > 0 && X <= 0) { /*if destination is west and north*/
		A = 360.0 - A0;
	} else if (B < 0 && X > 0) {  /*if destination is east and south*/
		A = 180.0 - A0;
	} else if (B >= 0 && X > 0) { /*if destination is west and south*/
		A = 180.0 + A0;
	} else {                      /*Should not go here*/
		A = A0;
		console.log("error")      /*Use to debug if direction is incorrect*/
	}
	
	return A.toFixed(2);
}

/*Calls Geolocation API*/
function deviceLocation() {
  	navigator.geolocation.getCurrentPosition(getPosition);
  	
  	/*Only enter if map() calls to update*/
  	if (update == 1) {
  		update = 0;
  		setTimeout(map, 0);
  	}
  	update = 0;
}

/*Sets position to device's latitude and longitude coordinates*/
function getPosition(position) {
	document.getElementById("clat").value = position.coords.latitude;
  	document.getElementById("clon").value = position.coords.longitude;
}