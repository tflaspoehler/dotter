import os

basedir = os.path.abspath(os.path.dirname(__file__))
class Config(object):

    ## define key
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'ello gov'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'dotter.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

