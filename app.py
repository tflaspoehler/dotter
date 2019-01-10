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
    date_complete = db.Column(db.String(28),  unique=False, nullable=False, primary_key=False)
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
    days = [dict(id=1, title='Bullet Journaling Introduction', text='''<br><br>
This is a very basic web application I've been tinkering with that mimics bulletjournaling (<a href="https://bulletjournal.com/">bulletjournal.com</a>). Many people keep personal/work notebooks to jot down notes throughout the day with little methodology for keeping it organized. bulletjournaling (<a href="https://bulletjournal.com/">bulletjournal.com</a>) is a simple method for keeping track of your daily life. For years, I used a very basic version of this so I thought I'd make a simple web app that follows my methodology. I'm sure there are better versions of this out there (including through the main website), but this is simply what I use. At the end of the day, this is more of a project to keep up to date with building user-friendly, useful web apps.
<br><br>
-Tim Flaspoehler'''),dict(id=2, title='Implementation TODO List', text='Here I am demonstrating the application by tracking its own development progress. Unfinished tasks (indicated by a checkbox) should be passed to each new day until finished. ')]
    lines=[[dict(id=3,  shape=2, check=False, important=False, date="null", parent_id=1, text="the 'x' deletes the lines and everything below",),
            dict(id=4,  shape=2, check=False, important=True,  date="null", parent_id=1, text="the '!' adds an indicator to emphasize importance/whatever",),
            dict(id=5,  shape=2, check=False, important=False, date="null", parent_id=1, text="the box/dot/circle indicate how the point should function",),
            dict(id=6,  shape=2, check=True,  important=False, date="null", parent_id=1, text="the boxes can be checked and unchecked",),
            dict(id=7,  shape=2, check=False, important=False, date="null", parent_id=1, text="the arrow changes the point between box/dot/circle",),
            dict(id=8,  shape=2, check=False, important=False, date="null", parent_id=1, text="the '+' adds a child line to the current point",),
            dict(id=2,  shape=2, check=False, important=False, date="null", parent_id=0, text="the different possible points are",),
            dict(id=1,  shape=2, check=False, important=False, date="null", parent_id=0, text="each line has a range of options when hovered over",),
            dict(id=9,  shape=0, check=True,  important=False, date="null", parent_id=2, text="a box to indicate a task to finish",),
            dict(id=10, shape=2, check=False, important=False, date="null", parent_id=2, text="a solid dot to indicate a note",),
            dict(id=11, shape=1, check=False, important=False, date="null", parent_id=2, text="a circle to indicate a meeting",),
            dict(id=12, shape=2, check=False, important=False, date="null", parent_id=0, text="settings are kept at the top and bottom of each page",)]]
    lines.append([dict(id=1,  shape=0, check=True,  important=False, date="null", parent_id=0, text="functional UI interactions",),
                  dict(id=3,  shape=0, check=True,  important=False, date="null", parent_id=1, text="naming for simple JavaScript functionality",),
                  dict(id=13, shape=0, check=True,  important=False, date="null", parent_id=1,text="make days collapsible",),
                  dict(id=14, shape=0, check=True,  important=False, date="null", parent_id=0,text="convert site to run on VPS",),
                  dict(id=15, shape=0, check=True,  important=False, date="null", parent_id=14,text="remove PHP to convert to Python/Flask",),
                  dict(id=16, shape=0, check=True,  important=False, date="null", parent_id=14,text="install nginx/Flask/etc.",),
                  dict(id=17, shape=0, check=True,  important=False, date="null", parent_id=14,text="build templates in Flask",),
                  dict(id=2,  shape=0, check=False, important=False, date="null", parent_id=0, text="establish Flask / JavaScript interactions",),
                  dict(id=4,  shape=0, check=True,  important=False, date="null", parent_id=2, text="send JSON from flask",),
                  dict(id=5,  shape=0, check=True,  important=False, date="null", parent_id=2, text="receive JSON in JavaScript",),
                  dict(id=6,  shape=0, check=True,  important=False, date="null", parent_id=2, text="build html from JSON on client-side JavaScript",),
                  dict(id=7,  shape=0, check=False, important=False, date="null", parent_id=2, text="read JavaScript JSON on server-side in Flask",),
                  dict(id=8,  shape=0, check=False, important=False, date="null", parent_id=0, text="build Flask database system w/ mysql (or potentially other db management)",),
                  dict(id=9,  shape=0, check=True,  important=False, date="null", parent_id=8, text="establish db layout",),
                  dict(id=10, shape=0, check=False, important=False, date="null", parent_id=8, text="build Flask functions to read/write to db",),
                  dict(id=11, shape=0, check=False, important=False, date="null", parent_id=10, text="read user data to send to JS on clientside",),
                  dict(id=12, shape=0, check=False, important=False, date="null", parent_id=10, text="write to db from JSON on clientside",),
                  dict(id=18, shape=0, check=False, important=False, date="null", parent_id=0, text="add user login",),
                  dict(id=19, shape=2, check=False, important=False, date="null", parent_id=18, text="probably want limited users due to small VPS currently",),
                  dict(id=20, shape=2, check=False, important=False, date="null", parent_id=18, text="may want to wait till fully functional to open up to outside users for testing",),
                  dict(id=21, shape=0, check=False, important=False, date="null", parent_id=0, text="add landing page for login/displaying books",),
                  dict(id=22, shape=0, check=True, important=False, date="null", parent_id=0, text="legitimize site",),
                  dict(id=23, shape=0, check=True, important=False, date="null", parent_id=22, text="get domain name",),
                  dict(id=25, shape=2, check=False, important=False, date="null", parent_id=23, text="dotter.app",),
                  dict(id=24, shape=0, check=True, important=False, date="null", parent_id=22, text="make ssl certs work in nginx",),])
    return jsonify(days=days, lines=lines)


@app.route('/landing.html')
def landing():
    return render_template('landing.html')
    
if __name__ == '__main__':
    app.run(debug=True)
