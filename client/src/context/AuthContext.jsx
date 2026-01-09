import { createContext, useContext, useState, useCallback } from 'react';
import { mockUser } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser); // Pre-populate with mock user for demo
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for demo
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await authApi.login(email, password);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await authApi.signup(name, email, password);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      const newUser = {
        ...mockUser,
        name,
        email,
        username: email.split('@')[0],
      };
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      // await authApi.logout();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await authApi.updateProfile(updates);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(prev => ({ ...prev, ...updates }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

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
