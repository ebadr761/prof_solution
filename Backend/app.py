# Group Members: Your Name (UCID), Friend's Name (UCID)
from flask import Flask, request, jsonify
from flask_cors import CORS
import json, random, os

app = Flask(__name__)
CORS(app)

# Load courses and testimonials from JSON files
def load_data(filename):
    path = os.path.join(os.path.dirname(__file__), filename)
    with open(path, 'r') as file:
        return json.load(file)

courses_data = load_data("courses.json")
testimonials_data = load_data("testimonials.json")

# In-memory storage for registered students with empty enrolled_courses arrays
students = [
    {
        "id": 1,
        "username": "mazin123",
        "password": "mazinpass",
        "email": "mazin@example.com",
        "enrolled_courses": []
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
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    for student in students:
        if student['username'] == username and student['password'] == password:
            return jsonify({"message": "Login successful! Redirecting...", "studentId": student["id"], "username": student["username"]}), 200

    return jsonify({"message": "Invalid username or password!"}), 401

@app.route('/testimonials', methods=['GET'])
def get_testimonials():
    # Return two random testimonials
    random_testimonials = random.sample(testimonials_data, 2)
    return jsonify(random_testimonials), 200

@app.route('/courses', methods=['GET'])
def get_courses():
    return jsonify(courses_data), 200

@app.route('/enroll/<int:student_id>', methods=['POST'])
def enroll_course(student_id):
    course = request.get_json()  # Expecting the full course object
    course_name = course.get('name')
    for student in students:
        if student['id'] == student_id:
            if any(c.get('name') == course_name for c in student['enrolled_courses']):
                return jsonify({"message": "Already enrolled in this course."}), 400
            student['enrolled_courses'].append(course)
            return jsonify({"message": "Enrolled successfully!"}), 200
    return jsonify({"message": "Student not found."}), 404

@app.route('/drop/<int:student_id>', methods=['DELETE'])
def drop_course(student_id):
    data = request.get_json()  # Expected to contain { "name": "Course Name" }
    course_name = data.get('name')
    for student in students:
        if student['id'] == student_id:
            for i, course in enumerate(student['enrolled_courses']):
                if course.get('name') == course_name:
                    del student['enrolled_courses'][i]
                    return jsonify({"message": "Course dropped successfully!"}), 200
            return jsonify({"message": "Course not found in enrolled courses."}), 400
    return jsonify({"message": "Student not found."}), 404

@app.route('/student_courses/<int:student_id>', methods=['GET'])
def student_courses(student_id):
    for student in students:
        if student['id'] == student_id:
            return jsonify(student['enrolled_courses']), 200
    return jsonify([]), 404

if __name__ == '__main__':
    app.run(debug=True)
