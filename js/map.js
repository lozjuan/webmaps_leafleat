var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoianVhbmxvemFubyIsImEiOiJjamRib3IzZncyMXByMzFwY3U5MWJ3czJtIn0.JcqssgK3BBEIfaoaJIkisA';
var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>'

var streets = L.tileLayer(mbUrl, { id: 'mapbox.streets', attribution: mbAttr }),
    light = L.tileLayer(mbUrl, { id: 'mapbox.light', attribution: mbAttr });

var map = L.map('map', {
    center: [16.07, -37.38],
    zoom: 2,
    layers: [streets, light]
    });

var world = new L.geoJson();
var capital_sa = new L.geoJson();
var capital_na = new L.geoJson();
var capital_eu = new L.geoJson();
var capital_af = new L.geoJson();
var capital_as = new L.geoJson();
var capital_oc = new L.geoJson();
var capital_an = new L.geoJson();

$.getJSON("data/world.geojson", function(data){
    world.addData(data).addTo(map);
});

$.getJSON("data/capital_SA.geojson", function(data){
    capital_sa.addData(data).addTo(map);
});

$.getJSON("data/capital_NA.geojson", function(data){
    capital_na.addData(data).addTo(map);
});

$.getJSON("data/capital_EU.geojson", function(data){
    capital_eu.addData(data).addTo(map);
});

$.getJSON("data/capital_AF.geojson", function(data){
    capital_af.addData(data).addTo(map);
});

$.getJSON("data/capital_AS.geojson", function(data){
    capital_as.addData(data).addTo(map);
});

$.getJSON("data/capital_OC.geojson", function(data){
    capital_oc.addData(data).addTo(map)
});

$.getJSON("data/capital_AN.geojson", function(data){
    capital_an.addData(data).addTo(map);
});

var overlays = {
    "Countries boundaries": world,
    "South america": capital_sa,
    "North america": capital_na,
    "Europe": capital_eu,
    "Afrique": capital_af,
    "Asia": capital_as,
    "Oceania": capital_oc,
    "Antartica": capital_an
}
var baseLayers = {
    "Light": light,
    "Streets": streets
}

L.control.layers(baseLayers, overlays).addTo(map);