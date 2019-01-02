## initial flask setup from the following site
##   https://medium.com/ymedialabs-innovation/deploy-flask-app-with-nginx-using-gunicorn-and-supervisor-d7a93aa07c18
from flask import Flask, render_template, request
from flask import jsonify

## database stuff from 
##   https://www.codementor.io/garethdwyer/building-a-crud-application-with-flask-and-sqlalchemy-dm3wv7yu2
from flask_sqlalchemy import SQLAlchemy

## python basics
import datetime
import os

class liner:
    def __init__(self, id, shape, check, important, date, parent_id, text):
        self.id = id
        self.shape = shape
        self.check = check
        self.important = important
        self.date = date
        self.parent_id = parent_id
        self.text = text

## start flask app
app = Flask(__name__)

## connect to database
cwd = os.path.dirname(os.path.abspath(__file__))
db_file = "sqlite:///{}".format(os.path.join(cwd, "dots.db"))
app.config["SQLALCHEMY_DATABASE_URI"] = db_file
db = SQLAlchemy(app)

## define our database classes
class line(db.Model):
    id   = db.Column(db.Integer(),  unique=True,  nullable=False, primary_key=True)
    text = db.Column(db.String(256), unique=False, nullable=False, primary_key=False)
    date = db.Column(db.String(28),  unique=False, nullable=False, primary_key=False)
    parent_id = db.Column(db.Integer(),  unique=False,  nullable=False, primary_key=False)
    user_id   = db.Column(db.Integer(),  unique=False,  nullable=False, primary_key=False)
    page_id   = db.Column(db.Integer(),  unique=False,  nullable=False, primary_key=False)
    book_id   = db.Column(db.Integer(),  unique=False,  nullable=False, primary_key=False)
    ## date = datetime.datetime.now()
    

    def __repr__(self):
        return "{}".format(self.text)

@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html')

@app.route("/lines", methods=["GET", "POST"])
def get_lines():
    days = [dict(id=1, title='Bullet Journaling Introduction', text='''<br><br>Many people keep personal/work notebooks to jot down notes throughout the day with little methodology for keeping it organized. Bullet journaling (bulletjournaling.com) is a simple method for keeping track of your daily life. For years, I used a very basic version of this so I thought I'd make a simple site that follows my methodology. Below are the basics of what I used. I'm sure there are better versions of this out there (including through the main website), but I have never used any. This is at the end of the day more of a project to keep up to date with building web applications.
<br><br>
-Tim Flaspoehler''')]
    lines=[[dict(id=1,  shape=2, check=False, important=False, date="null", parent_id=0, text="each line has a range of options when hovered over",),
            dict(id=3,  shape=2, check=False, important=False, date="null", parent_id=1, text="the 'x' deletes the lines and everything below",),
            dict(id=4,  shape=2, check=False, important=True,  date="null", parent_id=1, text="the '!' adds an indicator to emphasize importance/whatever",),
            dict(id=5,  shape=2, check=False, important=False, date="null", parent_id=1, text="the box/dot/circle indicate how the point should function",),
            dict(id=6,  shape=2, check=True,  important=False, date="null", parent_id=1, text="the boxes can be checked and unchecked",),
            dict(id=7,  shape=2, check=False, important=False, date="null", parent_id=1, text="the arrow changes the point between box/dot/circle",),
            dict(id=8,  shape=2, check=False, important=False, date="null", parent_id=1, text="the '+' adds a child line to the current point",),
            dict(id=2,  shape=2, check=False, important=False, date="null", parent_id=0, text="the different possible points are",),
            dict(id=9,  shape=0, check=False, important=False, date="null", parent_id=2, text="a box to indicate a task to finish",),
            dict(id=10, shape=2, check=False, important=False, date="null", parent_id=2, text="a solid dot to indicate a note",),
            dict(id=11, shape=1, check=False, important=False, date="null", parent_id=2, text="a circle to in   dicate a meeting",),
            dict(id=12, shape=2, check=False, important=False, date="null", parent_id=0, text="settings are kept at the top and bottom of each page",)]]
    return jsonify(days=days, lines=lines)
    
if __name__ == '__main__':
    app.run(debug=True)
