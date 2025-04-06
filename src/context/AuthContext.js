import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentId, setStudentId] = useState(null);

  const login = async (username, password) => {
    try {
      console.log('Login attempt starting...', { username });

      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Fetch response received:', {
        status: response.status,
        statusText: response.statusText,
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Login successful, updating state...');
        setIsAuthenticated(true);
        setStudentId(data.studentId);
        setUser({ username, studentId: data.studentId });
        localStorage.setItem('user', JSON.stringify({ 
          username, 
          studentId: data.studentId 
        }));
        return data;
      } else {
        console.error('Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Debug effect
  useEffect(() => {
    console.log('AuthContext: User state changed:', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, studentId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
