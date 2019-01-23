from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

def to_json(inst, cls):
    """
    Jsonify the sql alchemy query result.
    """
    convert = dict()
    # add your coversions for things like datetime's 
    # and what-not that aren't serializable.
    d = dict()
    for c in cls.__table__.columns:
        v = getattr(inst, c.name)
        if c.type in convert.keys() and v is not None:
            try:
                d[c.name] = convert[c.type](v)
            except:
                d[c.name] = "Error:  Failed to covert using ", str(convert[c.type])
        elif v is None:
            d[c.name] = str()
        else:
            d[c.name] = v
    return d

class user(UserMixin, db.Model):
    id   = db.Column(db.Integer(),  unique=True,  nullable=False, primary_key=True)
    username = db.Column(db.String(16), unique=True, nullable=False, primary_key=False)
    email = db.Column(db.String(64), unique=False, nullable=False, primary_key=False)
    first = db.Column(db.String(16), unique=False, nullable=False, primary_key=False)
    last = db.Column(db.String(16), unique=False, nullable=False, primary_key=False)
    password = db.Column(db.String(128))
    
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
        
    @property
    def json(self):
        return to_json(self, self.__class__)   
    
@login.user_loader
def load_user(user_id):
    try:
        return user.query.get(user_id)
    except:
        return None
        
## define our database classes
class line(db.Model):
    id   = db.Column(db.Integer(),  unique=True,  nullable=False, primary_key=True)
    text = db.Column(db.String(256), unique=False, nullable=False, primary_key=False)
    date = db.Column(db.String(28),  unique=False, nullable=False, primary_key=False)
    date_complete = db.Column(db.String(28),  unique=False, nullable=False, primary_key=False)
    check     = db.Column(db.Boolean, unique=False, default=True)
    important = db.Column(db.Boolean, unique=False, default=True)
    
    parent_id = db.Column(db.Integer(),   db.ForeignKey('line.id'))
    user_id   = db.Column(db.Integer(),   db.ForeignKey('user.id'))
    book_id   = db.Column(db.Integer(), db.ForeignKey('book.id'))
    day_id    = db.Column(db.Integer(), db.ForeignKey('day.id'))
    shape     = db.Column(db.Integer(),  unique=False,  nullable=False, primary_key=False)
    
    @property
    def json(self):
        return to_json(self, self.__class__)   
        
    def remove_line(self, id):
        for child in line.query.filter_by(parent_id=id).all():
            child.remove_line(child.id)
        print 'deleting line', id
        line.query.filter_by(id=id).delete()

## define our database classes
class day(db.Model):
    id   = db.Column(db.Integer(),  unique=True,  nullable=False, primary_key=True)
    title = db.Column(db.String(256), unique=False, nullable=False, primary_key=False)
    date = db.Column(db.String(28),  unique=False, nullable=False, primary_key=False)
    quote = db.Column(db.String(28),  unique=False, nullable=False, primary_key=False)
    user_id   = db.Column(db.Integer, db.ForeignKey('user.id'))
    book_id   = db.Column(db.Integer(), db.ForeignKey('book.id'))
    collapse = db.Column(db.Boolean, unique=False, default=False)
    
    @property
    def json(self):
        return to_json(self, self.__class__)   

    def remove_day(self, id):
        for child in line.query.filter_by(day_id=id).all():
            child.delete()
        print 'deleting day', id
        day.query.filter_by(id=id).delete()
## define our database classes
class book(db.Model):
    id   = db.Column(db.Integer(),  unique=True,  nullable=False, primary_key=True)
    title = db.Column(db.String(256), unique=True, nullable=False, primary_key=False)
    description = db.Column(db.String(256), unique=False, nullable=False, primary_key=False)
    date = db.Column(db.String(28),  unique=False, nullable=False, primary_key=False)
    user_id   = db.Column(db.Integer, db.ForeignKey('user.id'))
    public = db.Column(db.Boolean, unique=False, default=True)
    ## dots = db.Column(db.String(16),  unique=False, nullable=False, primary_key=False,
    ##     default=u'dots',
    ##     server_default=u'dots')
    
    @property
    def json(self):
        return to_json(self, self.__class__)    

    def remove_book(self, id):
        for child in line.query.filter_by(book_id=id).all():
            child.delete()
        for child in day.query.filter_by(book_id=id).all():
            child.delete()
        print 'deleting book', id
        book.query.filter_by(id=id).delete()