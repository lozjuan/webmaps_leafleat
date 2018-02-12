import requests
import geojson

url = "http://api.geonames.org/searchJSON?featureCode=PPLC&continentCode=AN&username=lozjuan"
result = requests.get(url)
data = result.json()


def geonames_to_geojson_point(outfile):
    """converts json data from geonames api to geojson. Outfile argument is a filepath"""
    capitals = []
    for i in data['geonames']:
        capitals.append(geojson.Feature(geometry=geojson.Point((round(float(i['lng']), 1), round(float(i['lat']), 1))),
                                        properties={'name': i['name'], 'country': i['countryName'], 'population': i['population']}))
    with open(outfile, 'w') as file:
        geojson.dump(geojson.FeatureCollection(capitals), file)c
