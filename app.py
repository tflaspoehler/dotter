## initial flask setup from the following site
##   https://medium.com/ymedialabs-innovation/deploy-flask-app-with-nginx-using-gunicorn-and-supervisor-d7a93aa07c18
from flask import Flask, render_template, request
from flask import jsonify

## database stuff from 
##   https://www.codementor.io/garethdwyer/building-a-crud-application-with-flask-and-sqlalchemy-dm3wv7yu2
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

## python basics
import datetime
import os

## config file to handle database and other things
from config import Config

## start flask app
app = Flask(__name__)
app.config.from_object(Config)

## import the database
db = SQLAlchemy(app)
migrate = Migrate(app, db)

import models
from models import user, line, book, day

@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route("/days", methods=["GET", "POST"])
def get_days():
    days = [d.json for d in day.query.all()]
    return jsonify(days=days)
    
@app.route("/lines", methods=["GET", "POST"])
def get_lines():
    data = request.get_json()
    requ = db.session.query(line)
    lines = requ.all()
    lines = [l.json for l in lines if l.day_id == data['id']]
    return jsonify(lines=lines)

@app.route("/lines_id", methods=["GET", "POST"])
def get_lines_id():
    data = request.get_json()
    return jsonify(data=data)

@app.route('/landing.html')
def landing():
    return render_template('landing.html')
    
@app.route('/get_books')
def get_books():
    books = book.query.all()
    return jsonify(data=[b.json for b in books])
    
if __name__ == '__main__':
    app.run(debug=True)
