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

var pointStyle = {
    radius: 3,
    fillColor: "blue",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

function getGDPClass(gdp) {
    return gdp > 1500000 ? '#800026' :
        gdp > 1000000 ? '#BD0026' :
        gdp > 600000 ? '#E31A1C' :
        gdp > 300000 ? '#FC4E2A' :
        gdp > 150000 ? '#FD8D3C' :
        gdp > 50000 ? '#FEB24C' :
        gdp > 20000 ? '#FED976' :
        '#FFEDA0';
}

var capital_sa = new L.geoJson(capital_sa, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.name + '</h1><p>population: ' + feature.properties.population + '</p>', {
            closeButton: false,
            offset: L.point(0, -20)
        });
        layer.on('mouseover', function() {
            layer.openPopup();
        });
        layer.on('mouseout', function() {
            layer.closePopup();

        });
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, pointStyle);
    },
    style: function(feature) {
        if (feature.properties.population > 1000000) {
            return {
                radius: feature.properties.population / 1000000 * 3
            }
        }
    }
});
var capital_na = new L.geoJson(capital_na, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.name + '</h1><p>population: ' + feature.properties.population + '</p>', {
            closeButton: false,
            offset: L.point(0, -20)
        });
        layer.on('mouseover', function() {
            layer.openPopup();
        });
        layer.on('mouseout', function() {
            layer.closePopup();
        });
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, pointStyle);
    },
    style: function(feature) {
        if (feature.properties.population > 1000000) {
            return {
                radius: feature.properties.population / 1000000 * 3
            }
        }
    }
});
var capital_eu = new L.geoJson(capital_eu, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.name + '</h1><p>population: ' + feature.properties.population + '</p>', {
            closeButton: false,
            offset: L.point(0, -20)
        });
        layer.on('mouseover', function() {
            layer.openPopup();
        });
        layer.on('mouseout', function() {
            layer.closePopup();
        });
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, pointStyle);
    },
    style: function(feature) {
        if (feature.properties.population > 1000000) {
            return {
                radius: feature.properties.population / 1000000 * 3
            }
        }
    }
});
var capital_af = new L.geoJson(capital_af, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.name + '</h1><p>population: ' + feature.properties.population + '</p>', {
            closeButton: false,
            offset: L.point(0, -20)
        });
        layer.on('mouseover', function() {
            layer.openPopup();
        });
        layer.on('mouseout', function() {
            layer.closePopup();
        });
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, pointStyle);
    },
    style: function(feature) {
        if (feature.properties.population > 1000000) {
            return {
                radius: feature.properties.population / 1000000 * 3
            }
        }
    }
});
var capital_as = new L.geoJson(capital_as, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.name + '</h1><p>population: ' + feature.properties.population + '</p>', {
            closeButton: false,
            offset: L.point(0, -20)
        });
        layer.on('mouseover', function() {
            layer.openPopup();
        });
        layer.on('mouseout', function() {
            layer.closePopup();
        });
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, pointStyle);
    },
    style: function(feature) {
        if (feature.properties.population > 1000000) {
            return {
                radius: feature.properties.population / 1000000 * 3
            }
        }
    }

});
var capital_oc = new L.geoJson(capital_oc, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.name + '</h1><p>population: ' + feature.properties.population + '</p>', {
            closeButton: false,
            offset: L.point(0, -20)
        });
        layer.on('mouseover', function() {
            layer.openPopup();
        });
        layer.on('mouseout', function() {
            layer.closePopup();
        });
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, pointStyle);
    },
    style: function(feature) {
        if (feature.properties.population > 1000000) {
            return {
                radius: feature.properties.population / 1000000 * 3
            }
        }
    }
});
var capital_an = new L.geoJson(capital_an, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.name + '</h1><p>population: ' + feature.properties.population + '</p>', {
            closeButton: false,
            offset: L.point(0, -20)
        });
        layer.on('mouseover', function() {
            layer.openPopup();
        });
        layer.on('mouseout', function() {
            layer.closePopup();
        });
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, pointStyle);
    },
    style: function(feature) {
        if (feature.properties.population > 1000000) {
            return {
                radius: feature.properties.population / 1000000 * 3
            }
        }
    }
});

var world = new L.geoJson(world, {
    style: function(feature) {
        return {
            fillColor: getGDPClass(feature.properties.gdp_md_est),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }
    }
});

$.getJSON("data/world.geojson", function(data){
    world.addData(data);
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
    "South america": capital_sa,
    "North america": capital_na,
    "Europe": capital_eu,
    "Afrique": capital_af,
    "Asia": capital_as,
    "Oceania": capital_oc,
    "Antartica": capital_an,
    "Countries boundaries": world
}
var baseLayers = {
    "Light": light,
    "Streets": streets
}

L.control.layers(baseLayers, overlays).addTo(map);