import requests
import geojson
import json
import pandas as pd
from app import app
from pandas.io.json import json_normalize


def geonames_to_geojson_point(outfile):
    """converts json data from geonames api to geojson. Outfile argument is a filepath"""
    continents = ['SA', 'NA', 'EU', 'OC', 'AS', 'AN', 'AF']
    capitals = []
    for i in continents:
        req = 'http://api.geonames.org/searchJSON?featureCode=PPLC&continentCode=' + i + '&username=lozjuan'
        r = requests.get(req)
        data_json = r.json()
        for x in data_json['geonames']:
            capitals.append(
                geojson.Feature(geometry=geojson.Point((round(float(x['lng']), 1), round(float(x['lat']), 1))),
                                properties={'name': x['name'], 'country': x['countryName'],
                                            'population': x['population']}))

    with open(outfile, 'w') as file:
        geojson.dump(geojson.FeatureCollection(capitals), file)


def wb_indicator_to_geojson_point(ind_code, year):
    """converts json data from world bank api to geojson point. Outfile argument is a filepath"""
    data_source = "http://api.worldbank.org/v2/countries/all/indicators/" \
                  "{0}?date={1}&format=json&per_page=300".format(ind_code, year)
    wb_raw = requests.get(data_source)
    wb_json = wb_raw.json()
    capital = []
    df = json_normalize(wb_json[1])
    if df['value'].dropna().empty:
        message = 'Data not available'
        return message
    else:
        with open('app/static/data/capitals.json', 'r', encoding='utf8') as source:
            capitals = json.load(source)
        for c in capitals['features']:
            for c1 in wb_json[1]:
                if c1['country']['value'] == c['properties']['country']:
                    capital.append(geojson.Feature(geometry=geojson.Point(c['geometry']['coordinates']),
                                                   properties={'country': c1['country']['value'],
                                                               'value': c1['value'],
                                                               'year': c1['date'],
                                                               'indicator': c1['indicator']['value']}))
        with open('app/static/data/wb_ind_point.json', 'w') as file:
            geojson.dump(geojson.FeatureCollection(capital), file)
        create_wb_legend_values('app/static/data/ind_legend_point.json', ind_code, year)


def wb_indicator_to_geojson_polygon(ind_code, year):
    """converts json data from world bank api to geojson polygon. Outfile argument is a filepath"""
    countries = []
    data_source = "http://api.worldbank.org/v2/countries/all/indicators/" \
                  "{0}?date={1}&format=json&per_page=300".format(ind_code, year)
    wb_raw = requests.get(data_source)
    wb_json = wb_raw.json()
    df = json_normalize(wb_json[1])
    if df['value'].dropna().empty:
        return 'Data not available'
    else:
        with open('app/static/data/world.geojson', 'r', encoding='utf8') as world:
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
        with open('app/static/data/wb_ind_polygon.json', 'w') as file:
            geojson.dump(geojson.FeatureCollection(countries), file)
        create_wb_legend_values('app/static/data/ind_legend_polygon.json', ind_code, year)


def create_wb_legend_values(outfile, ind_code, year):
    """Calculates legend values and saves it as json"""
    data_source = "http://api.worldbank.org/v2/countries/all/indicators/{0}?date={1}&format=json&per_page=300".format(
        ind_code, year)
    wb_raw = requests.get(data_source)
    wb_json = wb_raw.json()
    all_data = json_normalize(wb_json[1])
    values = pd.DataFrame(all_data['value'])
    quantiles = values.quantile([0.2, 0.4, 0.6, 0.8])
    bounds = quantiles['value'].tolist() + values.min().tolist() + values.max().tolist()
    i = iter(sorted(bounds))
    result = {x: next(i) for x in range(6)}
    with open(outfile, 'w') as file:
        file.write(json.dumps(result))


def get_indicator_codes(source, year):
    """Get codes from world bank indicators having 80% of data not null or NaN"""
    ind_info = 'http://api.worldbank.org/v2/indicators?format=json&per_page=17066'
    wb_raw = requests.get(ind_info)
    wb_json = wb_raw.json()
    all_indicator = json_normalize(wb_json[1])
    db_source = all_indicator[all_indicator['source.value'] == source]
    code_id = db_source['id'].to_frame()
    result = {}
    for c in code_id['id']:
        ind_data = "http://api.worldbank.org/v2/countries/all/indicators/{0}?date={1}&format=json&per_page=300".format(
            c, year)
        wb_raw = requests.get(ind_data)
        wb_json = wb_raw.json()
        if wb_json[1] is not None:
            df = json_normalize(wb_json[1])
            df1, df2 = df.iloc[:, 5:7], df.iloc[:, 9:].astype('float64')
            data = df1.join(df2, lsuffix='_df1', rsuffix='_df2')
            no_null_val = data.dropna()
            if not no_null_val.empty and len(no_null_val['value']) > 155:
                ind, name = ''.join(no_null_val.drop(columns=['value']).drop_duplicates()['indicator.id']), \
                            ''.join(no_null_val.drop(columns=['value']).drop_duplicates()['indicator.value'])
                result.update({ind: name})
                print(result)
    with open('app/static/data/wdi_codes.json', 'w') as file:
        file.write(json.dumps(result))


if __name__ == '__main__':
    app.run()
