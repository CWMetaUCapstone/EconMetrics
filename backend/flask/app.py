from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import PickleType
from flask_cors import CORS



app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:blu3Song85@localhost:5432/econmetrics"
db = SQLAlchemy(app)



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    salary_range = db.Column(db.String(50))
    location = db.Column(db.String(100))
    roommates = db.Column(db.Integer)
    children = db.Column(db.Integer)
    job_title = db.Column(db.String(100))
    transactions = db.Column(PickleType)


@app.route('/profiles', methods=['POST'])
def post_req_handler():
    data = request.get_json()
    request_obj = User(data=json.dumps(data))
    db.session.add(request_obj)
    db.session.commit()
    return jsonify({'message': 'Data saved!'})

def create_app():
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        app.run(port=3000)