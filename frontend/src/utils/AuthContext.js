import React, { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from './apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await apiClient.login({ username, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      
      const decodedToken = jwtDecode(token);
      setUser({ ...userData, ...decodedToken });
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data || 'An error occurred during login');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    apiClient.clearToken();
  };

  const value = {
    user,
    error,
    login,
    logout,
    isAuthenticated: !!user
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
