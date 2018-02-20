import requests
import geojson
import json
import numpy as np


def geonames_to_geojson_point(outfile):
    """converts json data from geonames api to geojson. Outfile argument is a filepath"""
    continents = ['SA', 'NA', 'EU', 'OC', 'AS', 'AN', 'AF']
    capitals = []
    for i in continents:
        req = 'http://api.geonames.org/searchJSON?featureCode=PPLC&continentCode=' + i + '&username=lozjuan'
        r = requests.get(req)
        data_json = r.json()
        for i in data_json['geonames']:
            capitals.append(
                geojson.Feature(geometry=geojson.Point((round(float(i['lng']), 1), round(float(i['lat']), 1))),
                                properties={'name': i['name'], 'country': i['countryName'],
                                            'population': i['population']}))

    with open(outfile, 'w') as file:
        geojson.dump(geojson.FeatureCollection(capitals), file)


def wb_indicator_to_geojson_point(ind_code, year):
    """converts json data from world bank api to geojson point. Outfile argument is a filepath"""
    data_source = "http://api.worldbank.org/v2/countries/all/indicators/" \
                  "{0}?date={1}&format=json&per_page=300".format(ind_code, year)
    wb_raw = requests.get(data_source)
    wb_json = wb_raw.json()
    capital = []
    with open("../data/capitals.json", 'r', encoding='utf8') as source:
        capitals = json.load(source)
    for c in capitals['features']:
        for c1 in wb_json[1]:
            if c1['country']['value'] == c['properties']['country']:
                capital.append(geojson.Feature(geometry=geojson.Point(c['geometry']['coordinates']),
                                               properties={'country': c1['country']['value'],
                                                           'value': c1['value'],
                                                           'year': c1['date'],
                                                           'indicator': c1['indicator']['value']}))
    with open('../data/wb_ind_point.json', 'w') as file:
        geojson.dump(geojson.FeatureCollection(capital), file)
    create_wb_legend_values('../data/ind_legend_point.json', ind_code, year)


def wb_indicator_to_geojson_polygon(ind_code, year):
    """converts json data from world bank api to geojson polygon. Outfile argument is a filepath"""
    countries = []
    data_source = "http://api.worldbank.org/v2/countries/all/indicators/" \
                  "{0}?date={1}&format=json&per_page=300".format(ind_code, year)
    wb_raw = requests.get(data_source)
    wb_json = wb_raw.json()
    with open("../data/world.geojson", 'r', encoding='utf8') as world:
        world = json.load(world)
    for c in world['features']:
        for c1 in wb_json[1]:
            if c1['country']['id'] == c['properties']['iso_a2'] and c['geometry']['type'] == "MultiPolygon":
                countries.append(geojson.Feature(geometry=geojson.MultiPolygon(c['geometry']['coordinates']),
                                                 properties={'country': c1['country']['value'],
                                                             'indicator': c1['indicator']['value'],
                                                             'value': c1['value'], 'year': c1['date']}))
            elif c1['country']['id'] == c['properties']['iso_a2'] and c['geometry']['type'] == "Polygon":
                countries.append(geojson.Feature(geometry=geojson.Polygon(c['geometry']['coordinates']),
                                                 properties={'country': c1['country']['value'],
                                                             'indicator': c1['indicator']['value'],
                                                             'value': c1['value'], 'year': c1['date']}))
    with open('../data/wb_ind_polygon.json', 'w') as file:
        geojson.dump(geojson.FeatureCollection(countries), file)
    create_wb_legend_values('../data/ind_legend_polygon.json', ind_code, year)


def create_wb_legend_values(outfile, ind_code, year):
    """Calculates the percentiles of a indicator list values and saves it as json for building legends"""
    data_source = "http://api.worldbank.org/v2/countries/all/indicators/" \
                  "{0}?date={1}&format=json&per_page=300".format(ind_code, year)
    wb_raw = requests.get(data_source)
    wb_json = wb_raw.json()
    raw_values = []
    percentiles = []
    for i in wb_json[1]:
        if i['countryiso3code'] != "":
            raw_values.append(i['value'])
    val = [x for x in raw_values if x is not None]
    cleaned_values = np.array(val)
    i = 0
    while i < 100:
        percentiles.append(np.percentile(cleaned_values, i + 12.5))
        i += 12.5
    int_percentiles = [int(round(x)) for x in percentiles]

    with open(outfile, 'w') as file:
        file.write(json.dumps(dict(enumerate(int_percentiles))))

wb_indicator_to_geojson_polygon('AG.LND.FRST.ZS', 2014)