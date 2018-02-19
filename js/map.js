var mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoianVhbmxvemFubyIsImEiOiJjamRib3IzZncyMXByMzFwY3U5MWJ3czJtIn0.JcqssgK3BBEIfaoaJIkisA';
var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>'

var streets = L.tileLayer(mbUrl, {
        id: 'mapbox.streets',
        attribution: mbAttr
    }),
    light = L.tileLayer(mbUrl, {
        id: 'mapbox.light',
        attribution: mbAttr
    });

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

function population(p) {
    return p > 1300000000 ? '#800026' :
        p > 1100000000 ? '#BD0026' :
        p > 90000000 ? '#E31A1C' :
        p > 60000000 ? '#FC4E2A' :
        p > 30000000 ? '#FD8D3C' :
        p > 10000000 ? '#FEB24C' :
        p > 5000000 ? '#FED976' :
        '#FFEDA0';
}

function getGDP(gdp) {
    return gdp > 10000000000000 ? '#800026' :
        gdp > 1000000000000 ? '#BD0026' :
        gdp > 100000000000 ? '#E31A1C' :
        gdp > 10000000000 ? '#FC4E2A' :
        gdp > 1000000000 ? '#FD8D3C' :
        gdp > 100000000 ? '#FEB24C' :
        gdp > 10000000 ? '#FED976' :
        '#FFEDA0';
}

function getlifeExp(le) {
    return le > 83 ? '#800026' :
        le > 81 ? '#BD0026' :
        le > 76 ? '#E31A1C' :
        le > 75 ? '#FC4E2A' :
        le > 72 ? '#FD8D3C' :
        le > 70 ? '#FEB24C' :
        le > 66 ? '#FED976' :
        '#FFEDA0';
}

function getPopulation(p) {
    if (p > 1000000) {
        return radius = p / 1000000 * 3
    }
};

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function highlightFeature(e) {
    var layer = e.target;
    indicatorInfo.update(layer.feature.properties);
}

function resetHighlight(e) {
    indicatorInfo.update();
}

var indicatorInfo = L.control();

indicatorInfo.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'indicatorInfo');
    this.update();
    return this._div;
};

indicatorInfo.update = function(props) {
    this._div.innerHTML = '<h4>GDP</h4>' + (props ?
        '<b>' + props.country + '</b><br />' + props.value + ' US dollar' :
        'Hover over a state');
};

var legend = L.control({ position: 'bottomright' });
$.getJSON("data/wb_gdp.json", function(data) {
    var properties = [];
    $.each(data.features, function(key, val) {
        $.each(val.properties, function(i, j) {
            properties.push(j);
        })
        console.log(properties);
    });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10000000, 100000000, 1000000000, 10000000000, 100000000000, 1000000000000, 10000000000000],
            labels = ['<strong> Word Bank API Data<br>'+ properties[2]+ ' ' + properties[3] +'</strong>'],
            values = ['0-10', '10-100', '100- 1000', '1000-10000', '10000-100000',
                '100000-1000000', '100000000-1000000000', '10000000000+'
            ],
            from;
        for (var i = 0; i < grades.length; i++) {
            value = values[i];
            from = grades[i];
            labels.push(
                '<i style="background:' + getGDP(from + 1) + '"></i> ' + value);
        }
        div.innerHTML = labels.join('<br>');
        return div
    };
});


var legend2 = L.control({ position: 'bottomleft' })
legend2.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5000000, 10000000, 30000000, 60000000, 90000000, 1100000000, 1300000000],
        labels = ['<strong>Country population</strong>'],
        values = ['0-5', '5-10', '10-30', '30-60', '60-90', '90-110', '110-130', '130+'],
        from;
    for (var i = 0; i < grades.length; i++) {
        value = values[i];
        from = grades[i];
        labels.push(
            '<i style="background:' + population(from + 1) + '"></i> ' + value);
    }
    div.innerHTML = labels.join('<br>');
    return div
};

var legend1 = L.control({ position: 'bottomleft' })
legend1.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 66, 70, 72, 75, 77, 81, 83],
        labels = ['<strong>Life expectancy</strong>'],
        values = ['66', '66-70', '70-72', '72-75', '75-77', '77-81', '81-83', '83+'],
        from;
    for (var i = 0; i < grades.length; i++) {
        value = values[i];
        from = grades[i];
        labels.push(
            '<i id="circle" style="background:' + getlifeExp(from + 1) + '"></i> ' + value);
    }
    div.innerHTML = labels.join('<br>');
    return div

};
var world = new L.geoJson(world, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.name + '</h1><p>population: ' + feature.properties.pop_est + '</p>', {
            closeButton: false,
            offset: L.point(0, -20)
        });
        layer.on('mouseover', function() {
            layer.openPopup();
        });
        layer.on('mouseout', function() {
            layer.closePopup();
        });
        layer.on({
            click: zoomToFeature,
        });
    },
    style: function(feature) {
        return {
            fillColor: population(feature.properties.pop_est),
            weight: 1,
            opacity: 1,
            color: "black",
            fillOpacity: 0.7
        }
    }
});

var wb_gdp = new L.geoJson(wb_gdp, {
    onEachFeature: function(feature, layer) {
        layer.on({
            click: zoomToFeature,
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
    },
    style: function(feature) {
        return {
            fillColor: getGDP(feature.properties.value),
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
        }
    }
});

var wb_lf_exp = new L.geoJson(wb_lf_exp, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.country + '</h1><p>life expectancy: ' + feature.properties.value + '</p>', {
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
        return {
            radius: 20,
            fillColor: getlifeExp(feature.properties.value),
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
        }
    }
});

var capitals = new L.geoJson(capitals, {
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
        layer.on({
            click: zoomToFeature
        });
    },
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, pointStyle);
    },
    style: function(feature) {
        return {
            radius: getPopulation(feature.properties.population)
        }
    }
});

$.getJSON("data/wb_gdp.json", function(data) {
    wb_gdp.addData(data).addTo(map)
});
$.getJSON("data/world.geojson", function(data) {
    world.addData(data)
});

$.getJSON("data/wb_life_exp.json", function(data) {
    wb_lf_exp.addData(data)
});

$.getJSON("data/capitals.json", function(data) {
    capitals.addData(data)
});

var overlays = {
    "GDP World Bank": wb_gdp,
    "Country population": world,
    "Capital": capitals,
    "Life expectancy": wb_lf_exp
}
var baseLayers = {
    "Light": light,
    "Streets": streets
}

indicatorInfo.addTo(map);
L.control.layers(baseLayers, overlays).addTo(map);

var capitalsLegend = L.control.htmllegend({
    position: 'bottomright',
    legends: [{
        name: 'Capital',
        layer: capitals,
        elements: [{
            label: 'Population',
            html: "<div id='circle'></div>"
        }]
    }],
});
map.addControl(capitalsLegend);

map.on('overlayadd', function(eventLayer) {
    switch (eventLayer.name) {
        case ('GDP World Bank'):
            legend.addTo(this);
            break;
        case ('Country population'):
            legend2.addTo(this);
            break;
        case ('Life expectancy'):
            legend1.addTo(this);
            break;
    }
});

map.on('overlayremove', function(eventLayer) {
    switch (eventLayer.name) {
        case ('GDP World Bank'):
            this.removeControl(legend);

            break;
        case ('Country population'):
            this.removeControl(legend2);
            break;
        case ('Life expectancy'):
            this.removeControl(legend1);
            break;
    }
});