# Standard library imports
import os
import json
import certifi
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import bcrypt
from dotenv import load_dotenv

#back4app BLS job imports
import requests
import urllib


# Plaid imports
from plaid.api import plaid_api
from plaid.model.country_code import CountryCode
from plaid.model.depository_account_subtype import DepositoryAccountSubtype
from plaid.model.depository_filter import DepositoryFilter
from plaid.model.link_token_account_filters import LinkTokenAccountFilters
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.api_client import ApiClient
from plaid.configuration import Configuration
import plaid

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

# Plaid Client Initialization
def create_plaid_client():
    configuration = Configuration()
    configuration.host = "https://sandbox.plaid.com"
    configuration.api_key['clientId'] = os.getenv('PLAID_CLIENT_ID')
    configuration.api_key['secret'] = os.getenv('PLAID_SECRET')
    configuration.ssl_ca_cert = certifi.where()
    api_client = ApiClient(configuration)
    return plaid_api.PlaidApi(api_client)

plaid_client = create_plaid_client()

# Database Models
class User(db.Model):
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    city = db.Column(db.String(120), nullable=True)
    salary = db.Column(db.String(120), nullable=True)
    roommates = db.Column(db.Integer, nullable=True)
    children = db.Column(db.Integer, nullable=True)
    job = db.Column(db.String(120), nullable=True)


# Flask Routes
@app.route('/profiles', methods=['POST'])
def post_req_handler():
    data = request.get_json()
    try:
        plain_password = data['password'].encode('utf-8')
        hashed_password = bcrypt.hashpw(plain_password, bcrypt.gensalt())
        encrypted_password = hashed_password.decode('utf-8')
        user = User(email=data['email'], password=encrypted_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Data saved!', 'userId': user.id}), 201
    except Exception as e:
        app.logger.error(f"Failed to create profile: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/profiles/<userId>', methods=['PUT'])
def put_req_handler(userId):
    data = request.get_json()
    try:
        user = User.query.get(userId)
        user.city = data['city']
        user.salary = data['salary']
        user.roommates = data['roommates']
        user.children = data['children']
        user.job = data['job']
        db.session.commit()
        return jsonify({'message': 'Profile updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/login', methods=['POST'])
def login_post_handler():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password').encode('utf-8')
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.checkpw(password, user.password.encode('utf-8')):
        return jsonify({'message': 'Login successful', 'userId': user.id}), 202
    else:
        return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/api/create_link_token/<userId>', methods=['POST'])
def create_link_token(userId):
    try:
        request = LinkTokenCreateRequest(
            products=[Products("transactions")],
            client_name="EconMetrics",
            country_codes=[CountryCode("US")],
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=userId  #tokens are associated with indiviual users
            )
        )
        response = plaid_client.link_token_create(request)
        return jsonify(response.to_dict())
    except plaid.ApiException as e:
        return jsonify(json.loads(e.body)), e.status


@app.route('/exchange_public_token', methods=['POST'])
def exchange_public_token():
    data = request.get_json()
    public_token = data.get('public_token')
    if not public_token:
        return jsonify({'error': 'Public token is required'}), 400

    try:
        exchange_response = plaid_client.item_public_token_exchange(public_token)
        access_token = exchange_response['access_token']
        return jsonify({'access_token': access_token}), 200
    except plaid.ApiException as e:
        return jsonify(json.loads(e.body)), e.status 
    

def create_app():
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        app.run(port=3000)
