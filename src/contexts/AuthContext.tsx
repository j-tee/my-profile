import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { tokenManager } from '../services/api';
import type { AuthContextType } from './AuthContext.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (tokenManager.isAuthenticated()) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          tokenManager.clearTokens();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.login(credentials);
      
      tokenManager.setTokens(response.tokens.access, response.tokens.refresh);
      setUser(response.user);
    } catch (err: unknown) {
      const error = err as { detail?: string; message?: string };
      const errorMessage = error.detail || error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      setError(null);
      setLoading(true);

      const response = await authService.register(data);
      
      tokenManager.setTokens(response.tokens.access, response.tokens.refresh);
      setUser(response.user);
    } catch (err: unknown) {
      const error = err as { detail?: string; message?: string };
      const errorMessage = error.detail || error.message || 'Registration failed. Please try again';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedUser: User): void => {
    setUser(updatedUser);
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'super_admin',
    isEditor: user?.role === 'editor' || user?.role === 'super_admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
