import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '@/config/auth';

const AuthContext = createContext(null);

const TOKEN_KEY = 'balraj_admin_token';
const LOGOUT_EVENT = 'balraj_admin_logout';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(null);
    localStorage.setItem(LOGOUT_EVENT, Date.now().toString());
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === LOGOUT_EVENT) {
        setAdmin(null);
      }
      if (e.key === TOKEN_KEY && !e.newValue) {
        setAdmin(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      setLoading(false);
      return;
    }

    getMe(token)
      .then((res) => setAdmin(res.data))
      .catch((err) => {
        // Network errors (backend unavailable) should NOT clear the token.
        // Only clear on explicit auth rejection (401/403).
        const isNetworkError = err instanceof TypeError || err.message === 'Failed to fetch' || err.message?.includes('NetworkError');
        if (isNetworkError) {
          const decoded = parseJwt(token);
          if (decoded) {
            setAdmin({ name: 'Admin', email: decoded.email || 'admin@balraj.com' });
          } else {
            localStorage.removeItem(TOKEN_KEY);
            setAdmin(null);
          }
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setAdmin(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, adminData) => {
    localStorage.setItem(TOKEN_KEY, token);
    setAdmin(adminData);
  };

  const updateAdmin = useCallback((data) => {
    setAdmin(data);
  }, []);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || isTokenExpired(token)) {
      logout();
      return false;
    }
    return true;
  }, [logout]);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, updateAdmin, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
