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
from sqlalchemy.sql import func
from decimal import Decimal
from sqlalchemy.exc import IntegrityError
from cryptography.fernet import Fernet
from sqlalchemy import or_
import re


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
from data_handling.data_processing import create_pie_plot

# load environment variables
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
    postal = db.Column(db.String(120), nullable=True)
    state = db.Column(db.String(120), nullable=True)
    salary = db.Column(db.String(120), nullable=True)
    roommates = db.Column(db.Integer, nullable=True)
    children = db.Column(db.Integer, nullable=True)
    job = db.Column(db.String(120), nullable=True)
    token = db.Column(db.String(120), nullable=True, unique=True) 
    transactions = relationship("Transactions", back_populates="user")
    goals = relationship("Goals", secondary='user_goals', back_populates="users")

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
    time = db.Column(db.DateTime, server_default=func.now())
    transaction_date = db.Column(db.Integer, nullable=True)

class Goals(db.Model):
    __tablename__ = 'Goals'
    id = db.Column(db.Integer, primary_key=True)
    users = relationship("User", secondary='user_goals', back_populates="goals")
    category = db.Column(db.String)
    value = db.Column(db.Integer)
    createdAt = db.Column(db.DateTime, server_default=func.now())
    deadline = db.Column(db.DateTime)

# the user_goals table serves as an intermediary between users and goals to facilitate the many-to-many relationship
user_goals = db.Table('user_goals',
    db.Column('id', db.Integer, primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('User.id')),
    db.Column('goal_id', db.Integer, db.ForeignKey('Goals.id'))
)


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
        # return the users id so they can be later identified
        return jsonify({'message': 'Data saved!', 'userId': user.id}), 201
    except IntegrityError as e:
        db.session.rollback()
        # Check if the error is due to a duplicate email
        if 'duplicate key value violates unique constraint' in str(e):
            return jsonify({'error': 'error at post_req_handler, email already has an account'}), 409
        else:
            return jsonify({'error': 'error at post_req_handler ' + str(e)}), 500
    except Exception as e:
        app.logger.error(f"error at post_req_handler, failed to create profile: {str(e)}")
        db.session.rollback()
        return jsonify({'error at post_req_handler': str(e)}), 500


@app.route('/profiles/<userId>', methods=['PUT'])
def put_req_handler(userId):
    data = request.get_json()
    try:
        user = User.query.get(userId)
        user.city = data['city']
        user.postal = data['postal']
        user.state = data['state']
        user.salary = data['salary']
        user.roommates = data['roommates']
        user.children = data['children']
        user.job = data['job']
        db.session.commit()
        return jsonify({'message': 'Profile updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error at put_req_handler': str(e)}), 500


@app.route('/profiles/<userId>', methods=['GET'])
def get_profile_data(userId):
    user = User.query.get(userId)
    return jsonify({'city' : user.city , 
                    'state' : user.state,
                    'salary' : user.salary, 
                    'roommates' : user.roommates, 
                    'children': user.children,
                    'jobs' : user.job,
                    'id' : user.id})


@app.route('/login', methods=['POST'])
def login_post_handler():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password').encode('utf-8')
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.checkpw(password, user.password.encode('utf-8')):
        return jsonify({'message': 'Login successful', 'userId': user.id}), 202
    else:
        return jsonify({'error at login_post_handler'}), 401


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
        access_token = exchange_response['access_token'].encode('utf-8')
        item_id = exchange_response['item_id']
        user = User.query.get(userId)
        # store the user's access token in user table, an access token provides repeated access to user's plaid-data
        # this token is encrypted for security
        # Encrypt the token
        key = os.getenv('ENCRYPTION_KEY')
        cipher = Fernet(key)
        encrypted_token = cipher.encrypt(access_token)
        user.token = encrypted_token.decode('utf-8')
        db.session.commit()
        return jsonify({'message': 'Access token exchanged successfully'})
    except Exception as e:
        print(f"error at exchange_public_token: {str(e)}")
        return jsonify({'error at exchange_public_token': str(e)}), 500


@app.route('/api/transactions/sync/<userId>', methods=['POST'])
def transactions_sync(userId):
    try:
        user = User.query.get(userId)
        # decrypt the access token from the database to use it
        encrypted_token = user.token
        key = os.getenv('ENCRYPTION_KEY')
        cipher = Fernet(key)
        decrypted_token = cipher.decrypt(encrypted_token.encode('utf-8')).decode('utf-8')

        request = TransactionsSyncRequest(access_token=decrypted_token)
        transactions = plaid_client.transactions_sync(request)
        # transaction object is by default non-serialable hence why we transform it to a dictionary
        transactions_data = {
            "transactions": [transaction.to_dict() for transaction in transactions.added]
        }
        clean_data = clean_transaction_data(transactions_data)
        user_transaction_data = aggregate_user_data(clean_data)
        db_status = save_transaction(userId, user_transaction_data)
        return jsonify({'message': db_status, 'data': user_transaction_data})
    except Exception as e:
        print(f"error at transactions_sync: {str(e)}")
        return jsonify({'error': 'error at transactions_sync'}), 500


@app.route('/transactions/<userId>', methods=['GET'])
def get_latest_transaction(userId):
    try: 
        user = User.query.get(userId)
        # of transactions associated with this users, get the most recent
        transaction = Transactions.query.filter_by(userId=user.id).order_by(Transactions.time.desc()).first()
        if transaction :
            # similar to above transactions are non-serialable so to return to client we need to be explicit in JSON formatting
            transaction_json = transaction_to_json(transaction)
            create_pie_plot(transaction_json, userId, transaction.id)
            return transaction_json
        else:
            return jsonify({'error at get_latest_transaction': 'unable to find transaction'})
    except Exception as e:
        print(f"error at get_latest_transaction: {str(e)}")
        return jsonify({'error': 'error at get_latest_transaction'}), 500
    

@app.route('/search/<query>', methods=['GET'])
def get_search_results(query):
    try:
        query_results = query_db(query)
        return jsonify(query_results), 200  
    except Exception as e:
        return jsonify({'error at get_search_results ': str(e)}), 500
    

@app.route('/users/<searchTerm>', methods=['GET'])
def get_users(searchTerm):
    try: 
        search = clean_search_term(searchTerm)
        users = User.query.filter(
                or_(
                    User.job == search,
                    User.salary == search,
                    User.city == search
                )
            ).all()
        result = []
        for user in users:
            # get the most recent transaction for each user
            transaction = Transactions.query.filter_by(userId=user.id).order_by(Transactions.time.desc()).first()
            # check to make sure the user has a transaction before calling the format helper
            if transaction:
                transaction_data = transaction_to_json(transaction)
            else:
                transaction_data = {}
            user_dict = {
                'id': user.id,
                'city': user.city,
                'state': user.state,
                'salary': user.salary,
                'roommates': user.roommates,
                'children': user.children,
                'job': user.job,
                'transaction': transaction_data
            }
            result.append(user_dict)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error at get_users': str(e)}), 500


@app.route('/similar', methods=['POST'])
def get_similar_users():
    try:
        profile_data = request.get_json()
        similar_transactions = find_similar_users(profile_data)
        return jsonify(similar_transactions)
    except Exception as e:
        print(f"error at get_similar_users: {str(e)}")


@app.route('/transId/<userId>', methods=['GET'])
def get_latest_trans_id(userId):
    user = User.query.get(userId)
    transaction = Transactions.query.filter_by(userId=user.id).order_by(Transactions.time.desc()).first()
    # return type at an endpoint cannot be int so id is cast to string 
    return str(transaction.id)


@app.route('/historical/<selectedOption>/<userId>', methods=['GET'])
def get_historical_data(selectedOption, userId):
    user = User.query.get(userId)
    transactions = Transactions.query.filter_by(userId=user.id).all()
    historical_data = historical_trans_json(selectedOption, transactions)
    return jsonify(historical_data)


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
        app.logger.error(f"error saving transaction for user {userId}: {e} at save_transaction")
        return f"an error occurred at save_transaction: {str(e)}"


"""
helper function to revert an entry in the transactions table back to JSON form
"""
def transaction_to_json(transaction):
    result = {}
    
    # iterate over each attribute in the transaction object
    for attr in dir(transaction):
        if not attr.startswith('_') and not callable(getattr(transaction, attr)):
            value = getattr(transaction, attr)
            # only considering non-null categories
            if value is not None:
                if isinstance(value, Decimal):
                    value = float(value)
                # map the attribute to its parent category
                parent_category = sum_category_map.get(attr, None)
                if parent_category:
                    if parent_category not in result:
                        result[parent_category] = {'total_percent': 0, 'details': []}
                    
                    # append the detail to the parent category
                    result[parent_category]['details'].append({'name': attr, 'percent': value})
    
    # set total_percent for each category
    for _, data in result.items():
        category_sum = sum(detail['percent'] for detail in data['details'])
        data['total_percent'] = category_sum
    return result


"""
helper function to query database and find rows matching the city, state, and salary fields of a user but not id, this 
keeps the user from being compared to themselves
"""
def find_similar_users(profileData):
    city = profileData['city']
    salary = profileData['salary']
    state = profileData['state']
    id = profileData['id']
    # get the current user so we can prevent them from being viewed as similar to themselves
    logged_in_user = User.query.get(id)
    users = User.query.filter(User.city == city, User.state == state, User.salary == salary).filter(User.id != logged_in_user.id).all()
    results = []
    for user in users:
        # get each relevant users most recent transaction
        transaction = Transactions.query.filter_by(userId=user.id).order_by(Transactions.time.desc()).first()
        results.append(user_to_json(user, transaction))
    return results

  
"""
helper function to take a search query, and check which category it matches across city, state, and salary.
salary is handled by the [handle_salary_query] helper function while city and job are handled by querying the 
[User] table to find all cities/jobs that are both in [query] and have at least 1 user representing the fields in the database.
This is done so search results will only appear when a result has at least one user to show on the search page
"""
def query_db(query):
    query = query.strip().lower()
    users = User.query
    results = []

    # numeric_filter is a regex used to check if the query is all numbers or has a dollar sign or a comma, 
    # if so, assume the search is for a salary and call the helper
    numeric_filter = re.match(r'^[\$]?[\d,]+$', query)
    if numeric_filter:
            salary_results = handle_salary_query(query, users)
            for salary in set(salary_results):
                results.append({'label': salary, 'category': 'salary'})
    else:
        # create search conditions across city, state, and job columns of User table case-agnostic for entries containing [query]
        city_search = or_(User.city.ilike(f"%{query}%"), User.state.ilike(f"%{query}%"))
        job_search= User.job.ilike(f"%{query}%")
        
        # apply the conditions onto User tables
        city_results = users.filter(city_search).with_entities(User.city, User.state).distinct().all()
        job_results = users.filter(job_search).with_entities(User.job).distinct().all()
        
        # sets enforce uniqueness so we only get distinct results
        unique_cities = set()
        unique_jobs = set()

        for city, state in city_results:
            unique_cities.add((city, state))
        
        for job in job_results:
            unique_jobs.add(job.job)
        for city, state in unique_cities:
            results.append({'label': f"{city}, {state}", 'category': 'city'})
        
        for job in unique_jobs:
            results.append({'label': job, 'category': 'job'})
    
    return results



"""
helper function to handele numerical search queries, this function considers all salary levels that have
at least one user in the database and checks to see if the query is within any of those ranges, this requires
formatting database entries into numerical values for the comparsion
"""
def handle_salary_query(query, user_query):
    try:
        numeric_query = int(query.replace(',', '').replace('$', ''))
        salary_search = []
        for salary_range in user_query.with_entities(User.salary).distinct():
            # check if the numerical value of query is covered under the ≤ or ≥ options for salary 
            if salary_range.salary.startswith('≤'):
                max_salary = int(salary_range.salary.split('$')[1].replace(',', ''))
                if numeric_query <= max_salary:
                    salary_search.append(User.salary == salary_range.salary)
            elif salary_range.salary.startswith('≥'):
                min_salary = int(salary_range.salary.split('$')[1].replace(',', ''))
                if numeric_query >= min_salary:
                    salary_search.append(User.salary == salary_range.salary)
            # otherwise if salary is a range, we need to format the range entry in the database into two numerical values
            # which is what the lambda function is for and then test if the query does fit within that range
            elif '-' in salary_range.salary:
                min_salary, max_salary = map(lambda x: int(x.strip().replace('$', '').replace(',', '')), salary_range.salary.split('-'))
                if min_salary <= numeric_query <= max_salary:
                    salary_search.append(User.salary == salary_range.salary)
        if salary_search:
            salary_results = user_query.filter(or_(*salary_search)).distinct().all()
            salary_list = []
            for user in salary_results:
                salary_list.append(user.salary)
            return salary_list
    except ValueError:
        return 'error at handle_salary_query'


"""
checks if [searchTerm] is a city and if so extracts the 'city' from 'city, state'. Job and Salary are already
clean so returns them untouched
"""
def clean_search_term(searchTerm):
    # strip any commans, hypens, dollar signs, and spaces in searchTerm to check the category
    # If isalpha, we know the type is city
    checkSearchType = re.sub(r'[\s,\-$]+', '', searchTerm)
    if checkSearchType.isalpha():
        if ',' in searchTerm:
                city = searchTerm.split(',')[0].strip()
                return city
        else:
            return searchTerm
    else:
        return searchTerm


"""
helper function to parse a transactions list and return an list with 
objects corresponding to historical data points
"""
def historical_trans_json(selectedOption, transactions):
    result = []
    for transaction in transactions:
        # interpret null entries as 0%
        percent_value = getattr(transaction, selectedOption) or 0
        result.append({'value': float(percent_value), 'date': transaction.transaction_date, 'name': selectedOption})
    return result


"""
helper function to create objects out of users including an object for transactions
"""
def user_to_json(user, transaction):
    result = {}
    result['id'] = user.id
    result['city'] = user.city + ', ' + user.state
    result['salary'] = user.salary
    result['job'] = user.job
    result['roommates'] = user.roommates
    result['children'] = user.children
    result['transaction'] = transaction_to_json(transaction)
    return result


def create_app():
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        app.run(port=3000)