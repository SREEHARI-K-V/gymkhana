import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gymkhana_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('gymkhana_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            const userData = res.data.user;
            userData.member_id = res.data.member_id;
            userData.trainer_id = res.data.trainer_id;
            setUser(userData);
            localStorage.setItem('gymkhana_user', JSON.stringify(userData));
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { user: userData, access_token, refresh_token, member_id, trainer_id } = res.data;
      userData.member_id = member_id;
      userData.trainer_id = trainer_id;

      setUser(userData);
      setToken(access_token);
      localStorage.setItem('gymkhana_user', JSON.stringify(userData));
      localStorage.setItem('gymkhana_token', access_token);
      localStorage.setItem('gymkhana_refresh_token', refresh_token);
      return res.data;
    }
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gymkhana_user');
    localStorage.removeItem('gymkhana_token');
    localStorage.removeItem('gymkhana_refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
