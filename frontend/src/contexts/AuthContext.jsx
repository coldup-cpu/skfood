import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/userAuth/profile', {
        withCredentials: true,
      });

      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/userAuth/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });

      if (response.data.token) {
        await checkAuthStatus();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post('/api/userAuth/signup', {
        name,
        email,
        password,
      }, {
        withCredentials: true,
      });

      if (response.data.token) {
        await checkAuthStatus();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.',
      };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post('/api/admin/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });

      if (response.data.token) {
        setIsAdmin(true);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Admin login failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      if (isAdmin) {
        await axios.post('/api/admin/logout', {}, { withCredentials: true });
      } else {
        await axios.post('/api/userAuth/logout', {}, { withCredentials: true });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    signup,
    adminLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
