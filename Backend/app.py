# Mazin Taher: 30185832
# Ebad Rehman: 30209407

from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

students = [
    {
        "id": 1,
        "username": "mazin123",
        "password": "mazinpass",
        "email": "mazin@example.com",
        "enrolled_courses": ["Web Development"]
    },
    {
        "id": 2,
        "username": "ebad456",
        "password": "ebadpass",
        "email": "ebad@example.com",
        "enrolled_courses": []
    }
]

@app.route('/')
def home():
    return "Flask app is running"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    for student in students:
        if student['username'] == username:
            return jsonify({"message": "Username already taken."}), 401

    new_student = {
        "id": len(students) + 1,
        "username": username,
        "password": password,
        "email": email,
        "enrolled_courses": []
    }
    students.append(new_student)

    return jsonify({"message": "Signup successful! Redirecting to login...", "student": new_student}), 201

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            print("No JSON data received")
            return jsonify({"message": "No data received"}), 400
            
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        print("\n=== Login Attempt ===")
        print(f"Raw request data: {data}")
        print(f"Processed credentials:")
        print(f"- Username: '{username}' (length: {len(username)})")
        print(f"- Password: '{password}' (length: {len(password)})")
        print(f"Available students: {[s['username'] for s in students]}\n")

        if not username or not password:
            print("Missing username or password")
            return jsonify({"message": "Username and password are required"}), 400

        for student in students:
            print(f"Checking student: {student['username']}")
            if student['username'] == username:
                print(f"Username match found!")
                print(f"Stored password: '{student['password']}'")
                print(f"Input password: '{password}'")
                print(f"Equal?: {student['password'] == password}")
                
                if student['password'] == password:
                    print("Login successful!")
                    return jsonify({
                        "message": "Login successful! Redirecting...",
                        "studentId": student["id"]
                    }), 200
                else:
                    print("Password mismatch")
                    return jsonify({"message": "Invalid password"}), 401
        
        print(f"No matching username found: {username}")
        return jsonify({"message": "Invalid username"}), 401

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"message": "Server error during login"}), 500

if __name__ == '__main__':
    app.run(debug=True)

