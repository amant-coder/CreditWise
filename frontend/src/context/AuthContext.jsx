import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('cw_token'));

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('cw_token');
    if (!storedToken) { setLoading(false); return; }
    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem('cw_token');
      localStorage.removeItem('cw_user');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('cw_token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const register = async (data) => {
    const res = await apiRegister(data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('cw_token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('cw_token');
    localStorage.removeItem('cw_user');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
