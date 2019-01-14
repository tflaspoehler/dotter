## initial flask setup from the following site
##   https://medium.com/ymedialabs-innovation/deploy-flask-app-with-nginx-using-gunicorn-and-supervisor-d7a93aa07c18
from flask import Flask, render_template, request, redirect, session
from flask import jsonify

## database stuff from 
##   https://www.codementor.io/garethdwyer/building-a-crud-application-with-flask-and-sqlalchemy-dm3wv7yu2
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

## python basics
import datetime, calendar
import os

## config file to handle database and other things
from config import Config

## start flask app
app = Flask(__name__)
app.config.from_object(Config)

## add user login/logout functionality
from flask_login import LoginManager, current_user, login_user, logout_user
login = LoginManager(app)
login.init_app(app)

## import the database
db = SQLAlchemy(app)
migrate = Migrate(app, db)
import models
from models import user, line, book, day


## -------------------------------------------
## define pages that will be displayed
## -------------------------------------------
## main app 
@app.route('/')
@app.route('/index.html')
def index():
    if (current_user.is_authenticated):
        books = book.query.filter_by(user_id = current_user.id).all()
        return render_template('index.html', books=books)
    else:
        books = book.query.filter_by(user_id = 1).filter_by(public = True).all()
        return render_template('index.html', books=books)

## testing for login
@app.route('/landing.html', methods=['GET', 'POST'])
def landing():
    forms = request.form
    if (current_user.is_authenticated):
        return redirect('/')
    else:
        if (request.form.get('uname') and request.form.get('psw')):
            u = user.query.filter_by(username = request.form.get('uname')).first()
            if (u.check_password(request.form.get('psw'))):
                login_user(u, remember=request.form.get('remember'))
                return redirect('/')
            else:
                return render_template('index.html', invalid=True)
        else:
            return redirect('/')
## logout
@app.route("/logout", methods=["GET", "POST"])
def logout():
    logout_user()
    return redirect('/')
## -------------------------------------------

## -------------------------------------------
## define functions for post/get methods
## -------------------------------------------
## send days for a user with titles/etc.
@app.route("/days", methods=["GET", "POST"])
def get_days():
    id = request.get_json()['id']
    session['id'] = id
    print 'getting day', id
    days = [d.json for d in day.query.filter_by(book_id = id).all()[::-1]]
    return jsonify(days=days)

## send lines for a specific day
@app.route("/lines", methods=["GET", "POST"])
def get_lines():
    data = request.get_json()
    lines = [l.json for l in line.query.filter_by(day_id = data['id']).all()]
    return jsonify(lines=lines)

## update text in a line
@app.route("/update_line", methods=["GET", "POST"])
def update_line():        
    data = request.get_json()
    l = line.query.get(int(data['id']))
    print data['id'], line
    if (current_user.is_authenticated and current_user.id == l.user_id):      
        print 'updating line:', data['text']
        l.text = data['text']
        db.session.commit()
    return
    
## update title text
@app.route("/update_title", methods=["GET", "POST"])
def update_title():        
    data = request.get_json()
    d = day.query.get(int(data['id']))
    print data['id'], d.title, data['title']
    if (current_user.is_authenticated and current_user.id == d.user_id):      
        print 'updating title:', data['title']
        d.title = data['title']
        db.session.commit()
    return

## test to send and recv data
@app.route("/lines_id", methods=["GET", "POST"])
def get_lines_id():
    data = request.get_json()
    return jsonify(data=data)
    
## get the books for a given user
@app.route('/get_books')
def get_books():
    books = book.query.all()
    return jsonify(data=[b.json for b in books])
    
## change public status of book
@app.route("/make_public", methods=["GET", "POST"])
def make_public():        
    data = request.get_json()
    b = book.query.get(data['id'])
    if (current_user.is_authenticated and current_user.id == b.user_id):
        b.public = data['checked']
        db.session.commit()
    return jsonify(id=data['id'])
    
## change public status of book
@app.route("/collapse_day", methods=["GET", "POST"])
def collapse_day():        
    data = request.get_json()
    print data
    d = day.query.get(data['id'])
    if (current_user.is_authenticated and current_user.id == d.user_id):
        d.collapse = not data['collapse']
        db.session.commit()
    return jsonify(id=data['id'])
    
## create a new book and reload the page
@app.route('/new_book', methods=['POST'])
def new_book():
    public = False
    if request.get_json()['public'] == True:
        public = True
    b = book(title=request.get_json()['title'], \
             description='', \
             date = '12/12/2018', \
             user_id = current_user.id,
             public=public)
    db.session.add(b)
    db.session.commit()
    return redirect('/')
    
## change a line parameter (and maybe delete)
@app.route('/modify_line', methods=['POST'])
def modify_line():
    data = request.get_json()
    l = line.query.get(int(data['id']))
    if (current_user.is_authenticated and current_user.id == l.user_id):
        if (data['type'] == 'change'):
            l.shape = data['value']
        elif (data['type'] == 'important'):
            l.important = not l.important
        elif (data['type'] == 'checked'):
            l.check = not l.check
        elif (data['type'] == 'delete'):
            l.remove_line(l.id)
        db.session.commit()
    return jsonify(id = data['id'])
    
## create a new line 
@app.route('/new_line', methods=['POST'])
def new_line():
    data = request.get_json()
    print 'adding new line to day', request.get_json()['day_id'], 'line', request.get_json()['line_id']
    now = datetime.datetime.now()
    date = '%s/%s/%s' % (now.month, now.day, now.year)
    d = day.query.get(int(data['day_id']))
    if (current_user.is_authenticated and current_user.id == d.user_id): 
        l = line(text='<br>', 
                 date=date, 
                 date_complete=date, 
                 check=False, 
                 important=False, 
                 parent_id=data['line_id'], 
                 user_id=d.user_id, 
                 book_id=d.book_id, 
                 day_id=d.id, 
                 shape=0)
        db.session.add(l)     
        db.session.commit()
        print 'commited session'
        return jsonify(id = l.id)
    return jsonify(id = 0)
    
## create a new book and reload the page
@app.route('/new_day', methods=['POST'])
def new_day():
    print request.get_json()
    print 'adding new day to book', request.get_json()['id']
    if (current_user.is_authenticated and current_user.id == book.query.filter_by(id=request.get_json()['id']).first().user_id):      
        now = datetime.datetime.now()
        date = '%s/%s/%s' % (now.month, now.day, now.year)
        d = day(title=calendar.day_name[datetime.date.today().weekday()] + ' ('+date+')', 
                                        date=date,
                                        quote='<br>',
                                        user_id=current_user.id,
                                        book_id=request.get_json()['id'])
        db.session.add(d)
        db.session.commit()
        return jsonify(id = d.id)
    else:
        return jsonify(id = 0)
    
## remove a day and all lines
@app.route('/delete_day', methods=['POST'])
def delete_day():
    data = request.get_json()
    d = day.query.get(int(data['id']))
    if (current_user.is_authenticated and current_user.id == d.user_id):
        d.remove_day(d.id)
        db.session.commit()
    return jsonify(id = data['id'])
    
## delete a book
@app.route('/delete_book', methods=['POST'])
def delete_book():
    print 'deleting book', request.get_json()['id']
    print current_user.is_authenticated, current_user.id,  book.query.filter_by(id=request.get_json()['id']).first().id
    if (current_user.is_authenticated and current_user.id == book.query.filter_by(id=request.get_json()['id']).first().user_id):
        book.query.filter_by(id=request.get_json()['id']).delete()
        line.query.filter_by(book_id=request.get_json()['id']).delete()
        day.query.filter_by(book_id=request.get_json()['id']).delete()
    
    db.session.commit()
    return jsonify(re=1)
## -------------------------------------------
    
if __name__ == '__main__':
    app.run(debug=True)
