import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { setOnUnauthorized } from '../api/client.js';
import { getStoredToken, setStoredToken } from '../api/config.js';
import { getMe, login as apiLogin, register as apiRegister } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await getMe();
      setUser(me);
    } catch (err) {
      setStoredToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  const login = async (email, password) => {
    const { user: u } = await apiLogin(email, password);
    setUser(u);
    return u;
  };

  const register = async (email, password) => {
    const { user: u } = await apiRegister(email, password);
    setUser(u);
    return u;
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  };

  const value = { user, loading, login, register, logout, loadUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
