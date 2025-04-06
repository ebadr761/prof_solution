import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateSignup = async (e) => {
    e.preventDefault();
    const newErrors = [];
    const { username, password, confirmPassword, email } = formData;

    const usernameValid = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
    if (!usernameValid.test(username)) {
      newErrors.push("Invalid username (Reason:...)");
    }

    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|;:'\",.<>?/`~])[^\s]{8,}$/;
    if (!passwordValid.test(password)) {
      newErrors.push("Invalid password (Reason:...)");
    }

    if (password !== confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.(com|net|io)$/;
    if (!emailValid.test(email)) {
      newErrors.push("Invalid email (Reason:...)");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setSuccess("");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          email
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(result.message);
        setErrors([]);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrors([result.message || "Registration failed."]);
        setSuccess("");
      }
    } catch (err) {
      setErrors(["Could not connect to server."]);
      setSuccess("");
    }
  };

  return (
    <main style={{
      padding: '20px',
      textAlign: 'center',
      alignItems: 'center',
      margin: '20px auto',
      maxWidth: '90%'
    }}>
      <h2 style={{ color: '#004080' }}>Sign Up</h2>
      <form onSubmit={validateSignup} style={{
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
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
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
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
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
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
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
      </form>

      <button 
        onClick={validateSignup}
        style={{
          marginTop: '25px',
          marginBottom: '10px',
          backgroundColor: '#008000',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          borderRadius: '5px'
        }}
      >
        Sign Up
      </button>

      {success && (
        <div className="success-box">
          <p>{success}</p>
        </div>
      )}

      {errors.length > 0 && (
        <div style={{ 
          color: '#D32F2F',
          backgroundColor: '#FFEBEE',
          padding: '10px',
          borderRadius: '4px',
          marginTop: '15px'
        }}>
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}

      <div style={{ marginTop: '15px' }}>
        <a href="/login" style={{
          color: '#004080',
          textDecoration: 'none'
        }}>Already have an account? Login here</a>
      </div>
    </main>
  );
};

export default RegForm;