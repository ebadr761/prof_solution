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
    <main className="login">
      <h2>Sign Up</h2>

      <form onSubmit={validateSignup}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="text" name="email" id="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="signUp">
          <button type="submit" className="signup-button">Sign Up</button>
        </div>
      </form>

      {success && (
        <div className="success-box">
          <p>{success}</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((error, i) => (
            <p key={i}>{error}</p>
          ))}
        </div>
      )}

      <a href="/login" id="login-account">Already have an account? Login here</a>
    </main>
  );
};

export default RegForm;
