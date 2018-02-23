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
    this._div.innerHTML = '<h4>Indicator Value</h4>' + (props ?
        '<b>' + props.country + '</b><br />' + props.value  :
        'Hover over a state');
};

//Polygon1 indicator map legend
var legend = L.control({ position: 'bottomright' });
var lab = [];
$.getJSON("static/data/ind_legend_polygon.json", function(data) {
    lab.push(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8])
});

function getColorlgd(c) {
    return c > lab[7] ? '#800026' :
        c > lab[6] ? '#BD0026' :
        c > lab[5] ? '#E31A1C' :
        c > lab[4] ? '#FC4E2A' :
        c > lab[3] ? '#FD8D3C' :
        c > lab[2] ? '#FEB24C' :
        c > lab[1] ? '#FED976' :
        c === null ? '#000' :
        '#FFEDA0';
}
$.getJSON("static/data/wb_ind_polygon.json", function(data) {
    var title = data.features[1].properties.indicator;
    var year = data.features[1].properties.year;
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [lab[0], lab[1], lab[2], lab[3], lab[4], lab[5], lab[6], lab[7]],
            labels = ['<strong> Word Bank API Data<br>' + title + ' ' + year + '</strong>'],
            values = ['< ' + lab[0].toString(), '< ' + lab[1].toString(), '< ' + lab[2].toString(),
                '< ' + lab[3].toString(), '< ' + lab[4].toString(), '< ' + lab[5].toString(), '< ' + lab[6].toString(), '+ ' + lab[7].toString()
            ],
            from;
        for (var i = 0; i < grades.length; i++) {
            value = values[i];
            from = grades[i];
            labels.push(
                '<i style="background:' + getColorlgd(from + 1) + '"></i> ' + value);
        }
        div.innerHTML = labels.join('<br>');
        return div
    };
});
//Polygon1 layer object (dynamic indicator)
var wb_polygon = new L.geoJson(wb_polygon, {
    onEachFeature: function(feature, layer) {
        layer.on({
            click: zoomToFeature,
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
    },
    style: function(feature) {
        return {
            fillColor: getColorlgd(feature.properties.value),
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
        }
    }
});
//Polygon2 map legend (country population static)
var legend2 = L.control({ position: 'bottomleft' })

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
//Polygone2 layer object (country population static) 
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
//Point map legend (dynamic legend)
var lab1 = [];
$.getJSON("static/data/ind_legend_point.json", function(data) {
    lab1.push(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8])
});
var legend1 = L.control({ position: 'bottomleft' })

function getColorPoint(c) {
    return c > lab1[7] ? '#800026' :
        c > lab1[6] ? '#BD0026' :
        c > lab1[5] ? '#E31A1C' :
        c > lab1[4] ? '#FC4E2A' :
        c > lab1[3] ? '#FD8D3C' :
        c > lab1[2] ? '#FEB24C' :
        c > lab1[1] ? '#FED976' :
        c === null ? '#000' :
        '#FFEDA0';

}
$.getJSON("static/data/wb_ind_point.json", function(data) {
    legend1.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = grades = [lab1[0], lab1[1], lab1[2], lab1[3], lab1[4], lab1[5], lab1[6], lab1[7]],
            labels = [data.features[1].properties.indicator + ' ' + data.features[1].properties.year],
            values = ['< ' + lab1[0].toString(), '< ' + lab1[1].toString(), '< ' + lab1[2].toString(),
                '< ' + lab1[3].toString(), '< ' + lab1[4].toString(), '< ' + lab1[5].toString(), '< ' + lab1[6].toString(), '+ ' + lab1[7].toString()
            ],
            from;
        for (var i = 0; i < grades.length; i++) {
            value = values[i];
            from = grades[i];
            labels.push(
                '<i id="circle" style="background:' + getColorPoint(from + 1) + '"></i> ' + value);
        }
        div.innerHTML = labels.join('<br>');
        return div

    };
});
//Point layer object (dynamic indicator)
var wb_point = new L.geoJson(wb_point, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup('<h1>' + feature.properties.country + '</h1><p><br>' + feature.properties.indicator + ' ' + feature.properties.value + '</p>', {
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
            fillColor: getColorPoint(feature.properties.value),
            weight: 1,
            opacity: 1,
            color: 'black',
            fillOpacity: 0.7
        }
    }
});
//Point layer object (capitals) 
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

$.getJSON("static/data/wb_ind_polygon.json", function(data) {
    wb_polygon.addData(data).addTo(map)
});
$.getJSON("static/data/world.geojson", function(data) {
    world.addData(data)
});

$.getJSON("static/data/wb_ind_point.json", function(data) {
    wb_point.addData(data)
});

$.getJSON("static/data/capitals.json", function(data) {
    capitals.addData(data)
});

var overlays = {
    "Country population": world,
    "Capital": capitals,
    "World Bank Indicator Polygon": wb_polygon,
    "World Bank Indicator Point": wb_point
}
var baseLayers = {
    "Light": light,
    "Streets": streets
}

indicatorInfo.addTo(map);
L.control.layers(baseLayers, overlays).addTo(map);

//Legend capitals layer (htmllegend plugin)
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
        case ('World Bank Indicator Polygon'):
            legend.addTo(this);
            break;
        case ('Country population'):
            legend2.addTo(this);
            break;
        case ('World Bank Indicator Point'):
            legend1.addTo(this);
            break;
    }
});

map.on('overlayremove', function(eventLayer) {
    switch (eventLayer.name) {
        case ('World Bank Indicator Polygon'):
            this.removeControl(legend);

            break;
        case ('Country population'):
            this.removeControl(legend2);
            break;
        case ('World Bank Indicator Point'):
            this.removeControl(legend1);
            break;
    }
});