from werkzeug.utils import redirect
from app import app
from flask import render_template, request
import logging

from app.get_data import wb_indicator_to_geojson_polygon, wb_indicator_to_geojson_point


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', title='Home')


@app.route('/get_polygon_indicator', methods=['GET', 'POST'])
def get_polygon_indicator():
    ind = request.form['polygon_ind']
    year = request.form['polygon_year']
    wb_indicator_to_geojson_polygon(ind, year)
    return redirect('/index')


@app.route('/get_point_indicator', methods=['GET', 'POST'])
def get_point_indicator():
    ind = request.form['point_ind']
    year = request.form['point_year']
    wb_indicator_to_geojson_point(ind, year)
    return redirect('/index')