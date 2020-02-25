markers = [];
mapbox_apikey = 'pk.eyJ1IjoiYm9idG9tODQ4MiIsImEiOiJjazZzMXh1YmEwYmJrM2ZtbHU1dm5pZW92In0.5070Es5hbrpyO-li0XagsA'; 
thunderforest_apikey = '030ae5a7c98549079b98e1a051b27cb7';
var mymap;
var myRenderer;
var centre = {
	ireland: [53.5,-7.9],
	switzerland: [47, 8.3]
};
var zoom = {
	ireland: 7,
	switzerland: 7
}

function start() {
	makeMap();
}

function makeMap() {
	mymap = L.map('mapid').setView(centre.ireland,zoom.ireland);	

	var Thunderforest_TransportDark = L.tileLayer(
		'https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey='+thunderforest_apikey, {
		attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		apikey: thunderforest_apikey,
		maxZoom: 22
	}).addTo(mymap);

	myRenderer = L.canvas({padding: 0.5});

	getData();

}

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYm9idG9tODQ4MiIsImEiOiJjazZzMXh1YmEwYmJrM2ZtbHU1dm5pZW92In0.5070Es5hbrpyO-li0XagsA', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoiYm9idG9tODQ4MiIsImEiOiJjazZzMXh1YmEwYmJrM2ZtbHU1dm5pZW92In0.5070Es5hbrpyO-li0XagsA'
// }).addTo(mymap);

function getData() {
	$.ajax({
		url : "https://raw.githubusercontent.com/MySupersuit/leaflet_test/master/js/assets/trains/stops.txt",
		// url : "https://raw.githubusercontent.com/SWENG-GROUP-24/GTFS-Cartogram/lineSegments/js/assets/trains/swiss_stops.txt",
		success : function (data) {
			parseCSV(data);
		}
	});
}

function parseCSV(csv) {
	parsed = Papa.parse(csv);
	plotPoints(parsed);
}

function plotPoints(csv) {
	for (let i = 1; i < csv.data.length-1; i++) {
		lat = csv.data[i][2];
		long = csv.data[i][3];
		let coord = L.latLng(lat,long);
		L.circleMarker(coord, {
			renderer: myRenderer,
			radius: 1
		}).addTo(mymap).bindPopup(csv.data[i][1]);
	}
}

/*
	Given two points and a ratio a:b finds the point
	which splits the line in ratio a:b

	Make b constant for one less variable?
	Start station will always be the same 
*/
function lineDividing(x1, y1, x2, y2, a, b) {
	p1 = (b*x1 + a*x2)/(a+b);
	p2 = (b*y1 + a*y2)/(a+b);
	return {p1,p2};
}

start();