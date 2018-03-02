from werkzeug.utils import redirect
from app import app
from flask import render_template, request
import json
from app.get_data import wb_indicator_to_geojson_polygon, wb_indicator_to_geojson_point

year = range(1990, 2018)
with open('app/static/data/wdi_codes.json', 'r') as codes:
    codes = json.load(codes)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', title='Home', codes=codes, year=year)


@app.route('/get_polygon_indicator', methods=['GET', 'POST'])
def get_polygon_indicator():
    global year
    global codes
    try:
        ind = request.form['polygon_ind']
        year = request.form['polygon_year']
        wb_indicator_to_geojson_polygon(ind, year)
    except:
        error_pol = "Please choose an indicator and a year"
        return render_template('index.html', title='Home', codes=codes, year=year, error_pol=error_pol)
    return redirect('/index')


@app.route('/get_point_indicator', methods=['GET', 'POST'])
def get_point_indicator():
    global year
    global codes
    try:
        ind = request.form['point_ind']
        year = request.form['point_year']
        wb_indicator_to_geojson_point(ind, year)
    except:
        error_point = "Please choose an indicator and a year"
        return render_template('index.html', title='Home', codes=codes, year=year, error_point=error_point)
    return redirect('/index')
