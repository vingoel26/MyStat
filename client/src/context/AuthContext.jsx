import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

// Storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      
      if (token && savedUser) {
        try {
          // Verify token is still valid by getting current user
          const response = await authApi.getMe();
          if (response.id) {
            setUser(response);
            setIsAuthenticated(true);
          } else {
            // Token expired or invalid, use saved user data
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          }
        } catch (error) {
          // If API fails, still use cached user
          try {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          } catch {
            // Clear invalid data
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      
      if (response.accessToken && response.user) {
        // Store tokens
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup(name, email, password);
      
      if (response.accessToken && response.user) {
        // Store tokens
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: response.error || 'Signup failed' };
    } catch (error) {
      return { success: false, error: error.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      // Clear local storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    setIsLoading(true);
    try {
      // For now, just update locally
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
