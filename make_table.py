from app import db
from models import user, line, book, day
import getpass


class liner:
    def __init__(self, id, shape, check, important, date, parent_id, text):
        self.id = id
        self.shape = shape
        self.check = check
        self.important = important
        self.date = date
        self.parent_id = parent_id
        self.text = text

## clear all tables in database
try:
    user.query.delete()
    line.query.delete()
    book.query.delete()
    day.query.delete()
except:
    print 'db already cleared'

## add user
u = user(username='tflaspoehler', email='tflaspoehler@gmail.com', first='Tim', last='Flaspoehler')
db.session.add(u)
db.session.commit()

## add books
b = book(title='introduction', \
         description='Gives a brief intro to the bullet-jounraling methodology in the context of this implementation. Also shows a todo list of what needs to be finished.', \
         date = '12/12/2018', \
         user_id = u.id,
         public=True)
db.session.add(b)
db.session.commit()

## add days to the book
days = [dict(id=1, title='Bullet Journaling Introduction', text='''<br><br>
This is a very basic web application I've been working on to mimic bulletjournaling (<a href="https://bulletjournal.com/">bulletjournal.com</a>). Many people keep personal/work notebooks to jot down notes throughout the day with little methodology for keeping it organized. bulletjournaling (<a href="https://bulletjournal.com/">bulletjournal.com</a>) is a simple method for keeping track of your daily life. For years, I used a very basic version of this so I thought I'd make a simple web app that follows my methodology. I'm sure there are better versions of this out there (including through the main website), but this is simply what I use. At the end of the day, this is more of a project to keep up to date with building user-friendly, useful web apps.
<br><br>
-Tim Flaspoehler'''),dict(id=2, title='Implementation TODO List', text='Here I am demonstrating the application by tracking its own development progress. Unfinished tasks (indicated by a checkbox) should be passed to each new day until finished. ')]

d = days[0]
print d['title']
db.session.add(day(title=d['title'], date=b.date, quote=d['text'], user_id=u.id, book_id=b.id))
db.session.commit()
lines = []
liners = [[dict(id=1,  shape=2, check=False, important=False, date="null", parent_id=0, text="the different possible points are",),
           dict(id=9,  shape=0, check=False,  important=False, date="null", parent_id=1, text="a box to indicate a task to finish",),
           dict(id=10, shape=2, check=False, important=False, date="null", parent_id=1, text="a solid dot to indicate a note",),
           dict(id=11, shape=1, check=False, important=False, date="null", parent_id=1, text="a circle to indicate a meeting",),],
          [dict(id=2,  shape=2, check=False, important=False, date="null", parent_id=0, text="each line shows options to the left when hovered over",),
           dict(id=3,  shape=2, check=False, important=False, date="null", parent_id=2, text="the 'x' deletes the lines and everything below",),
           dict(id=4,  shape=2, check=False, important=True,  date="null", parent_id=2, text="the '!' adds an indicator to emphasize importance/whatever",),
           dict(id=6,  shape=0, check=True,  important=False, date="null", parent_id=2, text="the boxes can be checked and unchecked",),
           dict(id=7,  shape=2, check=False, important=False, date="null", parent_id=2, text="the arrow changes the point between box/dot/circle",),
           dict(id=8,  shape=2, check=False, important=False, date="null", parent_id=2, text="the '+' adds a child line to the current point",),],]
for points in liners:
    l = points[0]
    lines.append(line(text=l['text'], date=b.date, date_complete=b.date, check=l['check'], important=l['important'], parent_id=0, user_id=u.id, book_id=b.id, day_id=d['id'], shape=l['shape']))
    db.session.add(lines[-1])
    db.session.commit()
    pid = lines[-1].id
    for point in points[1:]:
        l = point
        lines.append(line(text=l['text'], date=b.date, date_complete=b.date, check=l['check'], important=l['important'], parent_id=pid, user_id=u.id, book_id=b.id, day_id=d['id'], shape=l['shape']))
        db.session.add(lines[-1])
        db.session.commit()
        

## add books
b = book(title='dotter to-do list', \
         description='Gives a brief intro to the bullet-jounraling methodology in the context of this implementation. Also shows a todo list of what needs to be finished.', \
         date = '12/12/2018', \
         user_id = u.id,
         public=True)
db.session.add(b)
db.session.commit()
        
d = days[1]
print d['title']
db.session.add(day(title=d['title'], date=b.date, quote=d['text'], user_id=u.id, book_id=b.id))
db.session.commit()
lines = []
liners = [[dict(shape=0, check=True,  important=False, date="null", parent_id=0, text="functional UI interactions",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=1, text="naming for simple JavaScript functionality",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=1,text="make days collapsible",),
           dict(shape=0, check=False, important=False, date="null", parent_id=0, text="add landing page for login/displaying books",)],
          [dict(shape=0, check=True,  important=False, date="null", parent_id=0,text="convert site to run on VPS",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=14,text="remove PHP to convert to Python/Flask",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=14,text="install nginx/Flask/etc.",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=14,text="build templates in Flask",)],
          [dict(shape=0, check=False, important=False, date="null", parent_id=0, text="establish Flask / JavaScript interactions",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=2, text="send JSON from flask",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=2, text="receive JSON in JavaScript",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=2, text="build html from JSON on client-side JavaScript",),
           dict(shape=0, check=False, important=False, date="null", parent_id=2, text="read JavaScript JSON on server-side in Flask",)],
          [dict(shape=0, check=False, important=False, date="null", parent_id=0, text="build Flask database system w/ mysql (or potentially other db management)",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=8, text="establish db layout",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=8, text="build Flask functions to read/write to db",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=10, text="read user data to send to JS on clientside",),
           dict(shape=0, check=False, important=False, date="null", parent_id=10, text="write to db from JSON on clientside",)],
          [dict(shape=0, check=False, important=False, date="null", parent_id=0, text="add user login",),
           dict(shape=2, check=False, important=False, date="null", parent_id=18, text="probably want limited users due to small VPS currently",),
           dict(shape=2, check=False, important=False, date="null", parent_id=18, text="may want to wait till fully functional to open up to outside users for testing",)],
          [dict(shape=0, check=True,  important=False, date="null", parent_id=0, text="legitimize site",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=22, text="get domain name",),
           dict(shape=2, check=False, important=False, date="null", parent_id=22, text="dotter.app",),
           dict(shape=0, check=True,  important=False, date="null", parent_id=22, text="make ssl certs work in nginx",)],]
for points in liners:
    l = points[0]
    lines.append(line(text=l['text'], date=b.date, date_complete=b.date, check=l['check'], important=l['important'], parent_id=0, user_id=u.id, book_id=b.id, day_id=d['id'], shape=l['shape']))
    db.session.add(lines[-1])
    db.session.commit()
    pid = lines[-1].id
    for point in points[1:]:
        l = point
        lines.append(line(text=l['text'], date=b.date, date_complete=b.date, check=l['check'], important=l['important'], parent_id=pid, user_id=u.id, book_id=b.id, day_id=d['id'], shape=l['shape']))
        db.session.add(lines[-1])
        db.session.commit()
        

password = getpass.getpass('password:')
u.set_password(password)


db.session.commit()
