import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CourseItem from './CourseItem';
import EnrollmentList from './EnrollmentList';
import { useAuth } from '../context/AuthContext';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch all courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/courses');
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch enrolled courses for this student
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`http://localhost:5000/student_courses/${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch enrolled courses');
        const data = await response.json();
        setEnrolledCourses(data);
      } catch (err) {
        setError('Failed to load enrolled courses. Please try again later.');
        console.error('Error fetching enrolled courses:', err);
      }
    };
    fetchEnrolledCourses();
  }, [user]);

  const handleEnroll = async (course) => {
    if (!user?.id) {
      setError('Please log in to enroll in courses');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/enroll/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: course.name })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to enroll');
      }

      // Fetch updated enrolled courses
      const enrollmentResponse = await fetch(`http://localhost:5000/student_courses/${user.id}`);
      if (!enrollmentResponse.ok) throw new Error('Failed to update enrollment list');
      const updatedEnrollments = await enrollmentResponse.json();
      setEnrolledCourses(updatedEnrollments);
      
      alert(data.message);
    } catch (err) {
      setError(err.message || 'Failed to enroll in course');
      console.error('Error enrolling in course:', err);
    }
  };

  const handleRemove = async (courseName) => {
    if (!user?.id) {
      setError('Please log in to drop courses');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/drop/${user.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: courseName })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to drop course');
      }

      // Fetch updated enrolled courses
      const enrollmentResponse = await fetch(`http://localhost:5000/student_courses/${user.id}`);
      if (!enrollmentResponse.ok) throw new Error('Failed to update enrollment list');
      const updatedEnrollments = await enrollmentResponse.json();
      setEnrolledCourses(updatedEnrollments);
      
      alert(data.message);
    } catch (err) {
      setError(err.message || 'Failed to drop course');
      console.error('Error dropping course:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', padding: '20px', gap: '30px' }}>
        {error && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#FFEBEE',
            color: '#D32F2F',
            padding: '10px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}>
            {error}
          </div>
        )}
        <div style={{ flex: 3 }}>
          <h2 style={{ color: '#004080' }}>Available Courses</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {courses.map(course => (
              <CourseItem 
                key={course.id} 
                course={course} 
                onEnroll={handleEnroll}
                isEnrolled={enrolledCourses.some(ec => ec.name === course.name)}
              />
            ))}
          </div>
        </div>
        <EnrollmentList enrolledCourses={enrolledCourses} onRemove={handleRemove} />
      </div>
      <Footer />
    </div>
  );
};

export default CoursesPage;
