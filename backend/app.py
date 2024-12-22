import sqlite3

from flask import Flask, jsonify, request
from flask_cors import CORS
from login import login_bp
from signup import signup_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(signup_bp)
app.register_blueprint(login_bp)

# Register endpoint for login
@app.route('/Login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    # Connect to database and check credentials
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM USERS WHERE username = ?", (username,))
        result = cursor.fetchone()

        if result and result[0] == password:
            return jsonify({'message': 'Login successful!'}), 200
        else:
            return jsonify({'message': 'Invalid username or password!'}), 401

# Register endpoint for registration
@app.route('/Register', methods=['POST'])
def register():
    username = request.json.get('username')
    email = request.json.get('emailId')
    password = request.json.get('password')

    # Add new user to the database
    with sqlite3.connect('database.db') as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO USERS (username, email, password) VALUES (?, ?, ?)", (username, email, password))
        conn.commit()

    return jsonify({'message': 'Registration successful!'}), 201

@app.route("/")
def home():
    return redirect("http://localhost:3001/")  # Redirect to React app

if __name__ == "__main__":
    app.run(debug=True)
