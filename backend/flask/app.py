from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    port = 3000
    print(f"Server is running on http://localhost:{port}") 
    app.run(port=port)