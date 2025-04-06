import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        login({ id: data.studentId, name: data.username });
        setSuccess('Logged in successfully! Redirecting...');
        setTimeout(() => navigate('/courses'), 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server connection failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main style={{
        padding: '20px',
        textAlign: 'center',
        alignItems: 'center',
        margin: '20px auto',
        maxWidth: '90%'
      }}>
        <h2 style={{ color: '#004080' }}>LMS Login</h2>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#d4d4d4',
          boxShadow: '10px 10px 15px rgba(0, 0, 0, 0.1)',
          borderRadius: '30px',
          padding: '30px',
          margin: '20px 150px 0px 150px',
          maxWidth: '100%'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '20px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px'
          }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '250px',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '3px solid #b2b2b2',
                backgroundColor: 'lightyellow'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '20px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px'
          }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '250px',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '5px',
                border: '3px solid #b2b2b2',
                backgroundColor: 'lightyellow'
              }}
            />
          </div>

          {success && (
            <div style={{ 
              color: '#2E7D32',
              backgroundColor: '#E8F5E9',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {success}
            </div>
          )}

          {error && (
            <div style={{ 
              color: '#D32F2F',
              backgroundColor: '#FFEBEE',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              {error}
            </div>
          )}
        </form>

        <button 
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            marginTop: '25px',
            marginBottom: '10px',
            backgroundColor: isLoading ? '#BDBDBD' : '#008000',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            borderRadius: '5px'
          }}
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </button>

        <div>
          <a href="/signup" style={{
            color: '#004080',
            textDecoration: 'none'
          }}>Create an Account</a>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LoginForm;
