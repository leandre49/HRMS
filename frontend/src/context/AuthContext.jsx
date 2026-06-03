import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    setIsCheckingAuth(true);
    try {
      const res = await authService.getCurrentUser();
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setIsAuthenticated(true);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  const saveUser = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ username, password });
      if (res.data?.user) {
        saveUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveUser]);

  const register = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register({ username, password });
      if (res.data?.user) {
        saveUser(res.data.user);
      } else if (res.data?.userId) {
        saveUser({ id: res.data.userId, username });
      }
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      clearSession();
    } catch (err) {
      console.error('Logout error:', err);
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isCheckingAuth,
    login,
    register,
    logout,
    clearError: () => setError(null),
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
