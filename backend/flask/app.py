from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

def create_app():
    database = SQLAlchemy(app)
    return app, database

if __name__ == '__main__': 
    app, database = create_app()
    with app.app_context():
        database.create_all()
        app.run(port=3000)


