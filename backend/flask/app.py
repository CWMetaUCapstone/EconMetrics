from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:blu3Song85@localhost:5432/econmetrics"
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

@app.route('/profiles', methods=['POST'])
def post_req_handler():
    data = request.get_json()
    try:
        user = User(email=data['email'], password=data['password'])
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