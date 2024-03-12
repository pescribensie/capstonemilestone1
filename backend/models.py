from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence
from sqlalchemy.schema import Identity

db = SQLAlchemy()


class USERS(db.Model):
    __tablename__ = 'USERS'

    USERID = db.Column(db.Integer, primary_key=True)
    USERNAME = db.Column(db.String(100), nullable=False)
    PASSWORD = db.Column(db.String(100), nullable=False)

    stocks = db.relationship('STOCKS', backref='user', lazy=True)


class STOCKS(db.Model):
    __tablename__ = 'STOCKS'

    STOCKID = db.Column(db.Integer, primary_key=True)
    SYMBOL = db.Column(db.String(10), nullable=False)
    QUANTITY = db.Column(db.Integer, nullable=False)
    USERID = db.Column(db.Integer, db.ForeignKey('USERS.USERID'), nullable=False)