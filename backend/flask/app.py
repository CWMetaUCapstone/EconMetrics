from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import bcrypt

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:blu3Song85@localhost:5432/econmetrics"
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'User'  # because of difference in sqlalchemy and prisma naming conventions, name needs to be explicit
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    city = db.Column(db.String(120), nullable=True) 
    salary = db.Column(db.String(120), nullable=True) 
    roommates = db.Column(db.Integer, nullable=True)
    children = db.Column(db.Integer, nullable=True)
    job = db.Column(db.String(120), nullable=True)

@app.route('/profiles', methods=['POST'])
def post_req_handler():
    data = request.get_json()
    try:
        plain_password=data['password'].encode('utf-8')
        hashed_password = bcrypt.hashpw(plain_password, bcrypt.gensalt())
        encrypted_password = hashed_password.decode('utf-8')
        user = User(email=data['email'], password=encrypted_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Data saved!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def create_app():
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        app.run(port=3000)