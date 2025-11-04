import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/apiService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const ACCESS_TOKEN_KEY = 'access_token';
  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_DATA_KEY = 'user_data';

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_DATA_KEY);

      if (storedRefreshToken) {
        await refreshAccessToken(storedRefreshToken);
      } else if (storedAccessToken && storedUser) {
        setAccessToken(storedAccessToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (token) => {
    try {
      const response = await authService.refreshToken(token);

      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);

      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      if (!user && response.user) {
        setUser(response.user);
        await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(response.user));
      }

      return response.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      throw error;
    }
  };

  const handleAuthSuccess = async (response) => {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);

      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      
      const userData = response.user || {
        id: response.userId,
        email: response.email,
        name: response.name,
        picture: response.picture,
        emailVerified: response.emailVerified
      };
      
      setUser(userData);
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      await handleAuthSuccess(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const response = await authService.signup(email, password);
      await handleAuthSuccess(response);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async (logoutAll = false) => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken, logoutAll, user?.id);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);

      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  // Auto-refresh token
  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    const refreshInterval = setInterval(() => {
      refreshAccessToken(refreshToken);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, [accessToken, refreshToken]);

  const value = {
    user,
    loading,
    accessToken,
    signInWithEmail,
    signUpWithEmail,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};