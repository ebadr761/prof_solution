import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const RegForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple validators based on assignment requirements
  const validate = () => {
    const errs = {};
    // Username: 3-20 characters, starts with letter, alphanumeric/hyphen/underscore only.
    if (!/^[A-Za-z][A-Za-z0-9_-]{2,19}$/.test(formData.username)) {
      errs.username = "Username must be 3-20 characters, start with a letter and use only letters, numbers, hyphens or underscores.";
    }
    // Password: at least 8 characters, one uppercase, one lowercase, one number, one special char, no spaces.
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{}|;:'",.<>?/`~])[A-Za-z\d!@#$%^&*()\-_=+[\]{}|;:'",.<>?/`~]{8,}/.test(formData.password)) {
      errs.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    // Email: simple email format validation.
    if (!emailRegex.test(formData.email)) {
      errs.email = "Invalid email format.";
    }
    return errs;
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setServerMsg(data.message || "Signup failed");
      } else {
        setServerMsg(data.message);
        // Redirect to login after a brief delay
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setServerMsg("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Sign Up</h2>
      <div>
        <label>Username:</label>
        <input name="username" type="text" value={formData.username} onChange={handleChange} required />
        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
      </div>
      <div>
        <label>Email:</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>
      <div>
        <label>Password:</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} required />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      </div>
      <div>
        <label>Confirm Password:</label>
        <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
        {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
      </div>
      {serverMsg && <div style={{ margin: '10px 0', color: 'green' }}>{serverMsg}</div>}
      <button 
        type="submit" 
        disabled={isLoading}
        style={{
          backgroundColor: '#4CAF50',
          padding: '10px',
          borderRadius: '5px',
          margin: '10px 0',
          opacity: isLoading ? 0.5 : 1,
          border: 'none',
          color: 'white',
          cursor: 'pointer'
        }}
        onMouseOver={e => {
          if (!isLoading) {
            e.target.style.backgroundColor = "#45A049";
          }
        }}
        onMouseOut={e => {
          if (!isLoading) {
            e.target.style.backgroundColor = "#4CAF50";
          }
        }}
      >
        {isLoading ? "Signing up..." : "Signup"}
      </button>
    </form>
  );
};

export default RegForm;
