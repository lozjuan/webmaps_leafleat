import requests
import geojson
import json

url = "http://api.geonames.org/searchJSON?featureCode=PPLC&continentCode=AN&username=lozjuan"
result = requests.get(url)
data = result.json()
url2 = "http://api.worldbank.org/v2/countries/all/indicators/NY.GDP.MKTP.CD?date=2002&format=json&per_page=300"
wb = requests.get(url2)
wb_data = wb.json()


def geonames_to_geojson_point(outfile):
    """converts json data from geonames api to geojson. Outfile argument is a filepath"""
    capitals = []
    for i in data['geonames']:
        capitals.append(geojson.Feature(geometry=geojson.Point((round(float(i['lng']), 1), round(float(i['lat']), 1))),
                                        properties={'name': i['name'], 'country': i['countryName'],
                                                    'population': i['population']}))
    with open(outfile, 'w') as file:
        geojson.dump(geojson.FeatureCollection(capitals), file)


def wb_indicator_to_geojson(outfile):
    """converts json data from world bank api to geojson. Outfile argument is a filepath"""
    countries = []
    with open("../data/world.geojson", 'r', encoding='utf8') as world:
        world = json.load(world)
    for c in world['features']:
        for c1 in wb_data[1]:
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

    with open(outfile, 'w') as file:
        geojson.dump(geojson.FeatureCollection(countries), file)
