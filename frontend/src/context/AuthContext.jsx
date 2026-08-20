import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('campus360_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campus360_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('campus360_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Failed to verify token on app mount:', err.message);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user: userData, token: jwtToken } = res.data.data;
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('campus360_token', jwtToken);
        localStorage.setItem('campus360_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('campus360_token');
    localStorage.removeItem('campus360_user');
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
