import json

from flask import render_template, request
from werkzeug.utils import redirect

from app import app
from app.get_data import wb_indicator_to_geojson_polygon, wb_indicator_to_geojson_point

year = list(range(1990, 2017))
with open('app/static/data/wdi_codes.json', 'r') as codes:
    codes = json.load(codes)


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', title='Home', codes=codes, year=year)


@app.after_request
def add_header(response):
    """Avoid cache Json files to be saved in browser in order to display data dynamically"""
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0"
    return response


@app.route('/get_polygon_indicator', methods=['GET', 'POST'])
def get_polygon_indicator():
    global codes
    global year
    try:
        ind = request.form['polygon_ind']
        date = request.form['polygon_year']
        wb_indicator_to_geojson_polygon(ind, date)
        if wb_indicator_to_geojson_polygon(ind, date) == 'Data not available':
            return render_template('index.html', title='Home', codes=codes, year=year, error_pol='Data not available')
    except:
        error_pol = "Please choose anr indicator and a year"
        return render_template('index.html', title='Home', codes=codes, year=year, error_pol=error_pol)
    return redirect('/index')


@app.route('/get_point_indicator', methods=['GET', 'POST'])
def get_point_indicator():
    global codes
    global year
    try:
        ind = request.form['point_ind']
        date = request.form['point_year']
        wb_indicator_to_geojson_point(ind, date)
        if wb_indicator_to_geojson_point(ind, date) == 'Data not available':
            return render_template('index.html', title='Home', codes=codes, year=year, error_point='Data not available')
    except:
        error_point = "Please choose an indicator and a year"
        return render_template('index.html', title='Home', codes=codes, year=year, error_point=error_point)
    return redirect('/index')
