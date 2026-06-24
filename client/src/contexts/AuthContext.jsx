import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('disaster_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('disaster_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('disaster_token', token);
    setToken(token);
    setUser(user);
    return user;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token, user } = res.data;
    localStorage.setItem('disaster_token', token);
    setToken(token);
    setUser(user);
    return user;
  };

  const googleLogin = async (googleUserPayload) => {
    // googleUserPayload is { name: 'Demo User', email: 'demo@google.com' }
    const res = await api.post('/auth/google', googleUserPayload);
    const { token: jwtToken, user } = res.data;
    localStorage.setItem('disaster_token', jwtToken);
    setToken(jwtToken);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('disaster_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
