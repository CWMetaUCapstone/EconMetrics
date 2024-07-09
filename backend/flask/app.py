# Standard library imports
import os
import json
import certifi
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from flask_cors import CORS
import bcrypt
from dotenv import load_dotenv

# Plaid imports
from plaid.api import plaid_api
from plaid.model.country_code import CountryCode
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.api_client import ApiClient
from plaid.configuration import Configuration
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
import plaid

# import functions and maps for transaction data processing
from data_handling.data_processing import clean_transaction_data
from data_handling.data_processing import aggregate_user_data
from data_handling.data_maps import sum_category_map

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
    token = db.Column(db.String(120), nullable=True) # should be unique for prod
    transactions = relationship("Transactions", back_populates="user")

class Transactions(db.Model):
    __tablename__ = 'Transactions'
    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, ForeignKey('User.id'))
    user = relationship("User", back_populates="transactions")
    
    rent = db.Column(db.Numeric(13, 2), nullable=True)
    utilities = db.Column(db.Numeric(13, 2), nullable=True)
    housing = db.Column(db.Numeric(13, 2), nullable=True)
    loans = db.Column(db.Numeric(13, 2), nullable=True)
    student_loans = db.Column(db.Numeric(13, 2), nullable=True)
    car_loans_and_lease = db.Column(db.Numeric(13, 2), nullable=True)
    credit_card_payments = db.Column(db.Numeric(13, 2), nullable=True)
    other_loans = db.Column(db.Numeric(13, 2), nullable=True)
    entertainment = db.Column(db.Numeric(13, 2), nullable=True)
    streaming_services = db.Column(db.Numeric(13, 2), nullable=True)
    other_entertainment = db.Column(db.Numeric(13, 2), nullable=True)
    food = db.Column(db.Numeric(13, 2), nullable=True)
    restaurants = db.Column(db.Numeric(13, 2), nullable=True)
    groceries = db.Column(db.Numeric(13, 2), nullable=True)
    medical_care = db.Column(db.Numeric(13, 2), nullable=True)
    transportation = db.Column(db.Numeric(13, 2), nullable=True)
    gas = db.Column(db.Numeric(13, 2), nullable=True)
    parking = db.Column(db.Numeric(13, 2), nullable=True)
    ride_share = db.Column(db.Numeric(13, 2), nullable=True)
    public_transit = db.Column(db.Numeric(13, 2), nullable=True)
    other_transportation = db.Column(db.Numeric(13, 2), nullable=True)
    merchandise = db.Column(db.Numeric(13, 2), nullable=True)
    retail = db.Column(db.Numeric(13, 2), nullable=True)
    apparel = db.Column(db.Numeric(13, 2), nullable=True)
    e_commerce = db.Column(db.Numeric(13, 2), nullable=True)
    electronics = db.Column(db.Numeric(13, 2), nullable=True)
    pet_supplies = db.Column(db.Numeric(13, 2), nullable=True)
    super_stores = db.Column(db.Numeric(13, 2), nullable=True)
    other_merchandise = db.Column(db.Numeric(13, 2), nullable=True)
    other_expenses = db.Column(db.Numeric(13, 2), nullable=True)
    gym_membership = db.Column(db.Numeric(13, 2), nullable=True)
    financial_planning = db.Column(db.Numeric(13, 2), nullable=True)
    legal_services = db.Column(db.Numeric(13, 2), nullable=True)
    insurance = db.Column(db.Numeric(13, 2), nullable=True)
    tax_payments = db.Column(db.Numeric(13, 2), nullable=True)
    travel = db.Column(db.Numeric(13, 2), nullable=True)
    investment_and_saving = db.Column(db.Numeric(13, 2), nullable=True)
    investment = db.Column(db.Numeric(13, 2), nullable=True)
    savings_account = db.Column(db.Numeric(13, 2), nullable=True)


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
        # return the users id so they can be later identified
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


@app.route('/profiles/<userId>', methods=['GET'])
def get_profile_data(userId):
    user = User.query.get(userId)
    return jsonify({'city' : user.city , 
                'salary' : user.salary, 
                'roommates' : user.roommates, 
                'children': user.children,
                'jobs' : user.job})


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
            # tokens are associated with indiviual users and therefore each user makes a unique request to plaid for link
            user=LinkTokenCreateRequestUser(
                client_user_id=userId
            )
        )
        response = plaid_client.link_token_create(request)
        return jsonify(response.to_dict())
    except plaid.ApiException as e:
        return jsonify(json.loads(e.body)), e.status


@app.route('/api/exchange_public_token/<userId>', methods=['POST'])
def exchange_public_token(userId):
    public_token = request.json['public_token']
    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token
        )
        exchange_response = plaid_client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']
        user = User.query.get(userId)
        # store the user's access token in user table, an access token provides repeated access to user's plaid-data
        user.token = access_token
        db.session.commit()
        
        return jsonify({
            'access_token': access_token,
            'item_id': item_id,
            'public_token_exchange': 'complete'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions/sync/<userId>', methods=['POST'])
def transactions_sync(userId):
    try:
        # get the user's access_token from the user table
        user = User.query.get(userId)
        request = TransactionsSyncRequest(
            access_token=user.token
        )
        transactions = plaid_client.transactions_sync(request)
        # transaction object is by default non-serialable hence why we transform it to a dictionary
        transactions_data = {
            "transactions": [transaction.to_dict() for transaction in transactions.added]
        }
        clean_data =  clean_transaction_data(transactions_data)
        user_transaction_data = aggregate_user_data(clean_data)
        db_status = save_transaction(userId, user_transaction_data)

        return jsonify({'message': db_status, 'data': user_transaction_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/transactions/<userId>', methods=['GET'])
def get_latest_transaction(userId):
    user = User.query.get(userId)
    transaction = user.transactions[-1]
    if transaction :
        # similar to above transactions are non-serialable so to return to client we need to be explicit in JSON formatting
        return transaction_to_json(transaction)
    else:
        return jsonify({'error': 'unable to find transaction'})



# Helper Functions
"""
helper to post the transaction data found by [aggregate_user_data] into an associated Transaction table
in the database associated with the user
"""
def save_transaction(userId, transactionData):
    try:
        transaction = Transactions(userId=userId)
        
        # loop through each sum/main category in transactionData to access sub-fields and add self to table
        for category, data in transactionData.items():
            total_percent_attr = category
            if hasattr(transaction, total_percent_attr):
                setattr(transaction, total_percent_attr, data['total_percent'])
            
           # handle sub-categories as well
            for detail in data['details']:
                sub_category_attr = detail['name']  
                if hasattr(transaction, sub_category_attr):
                    setattr(transaction, sub_category_attr, detail['percent'])

        db.session.add(transaction)
        db.session.commit()
        
        return "Transaction data saved successfully."
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error saving transaction for user {userId}: {e}")
        return f"An error occurred: {str(e)}"

"""
helper function to revert an entry in the transactions table back to JSON form
"""
def transaction_to_json(transaction):
    # Initialize the result dictionary
    result = {}
    
    # Iterate over each attribute in the transaction object
    for attr in dir(transaction):
        if not attr.startswith('_') and not callable(getattr(transaction, attr)):
            value = getattr(transaction, attr)
            # only considering non-null categories
            if value is not None:
                # Map the attribute to its parent category
                parent_category = sum_category_map.get(attr, None)
                if parent_category:
                    if parent_category not in result:
                        result[parent_category] = {'total_percent': 0, 'details': []}
                    
                    # Append the detail to the parent category
                    result[parent_category]['details'].append({'name': attr, 'percent': value})
    
    # Set total_percent for each category
    for _, data in result.items():
        category_sum = sum(detail['percent'] for detail in data['details'])
        data['total_percent'] = category_sum
    return result

def create_app():
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        app.run(port=3000)