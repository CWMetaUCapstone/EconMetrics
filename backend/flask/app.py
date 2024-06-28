from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import PickleType
from flask_cors import CORS
import json



app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:blu3Song85@localhost:5432/econmetrics"
db = SQLAlchemy(app)

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