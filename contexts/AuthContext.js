import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { authService } from '../services/apiService';
import { makeRedirectUri } from 'expo-auth-session';

import { API_GOOGLE_URL } from '../config/api';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: API_GOOGLE_URL,
    redirectUri: makeRedirectUri({
      scheme: 'shelfie',
      useProxy: true,
    }),
    
    scopes: ['openid', 'profile', 'email'],
  });

  // Token storage keys
  const ACCESS_TOKEN_KEY = 'access_token';
  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_DATA_KEY = 'user_data';

  // Load stored tokens on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSignIn(response.params.id_token);
    }
  }, [response]);

  const loadStoredAuth = async () => {
    try {
      const storedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_DATA_KEY);

      if (storedRefreshToken) {
        // Try to refresh the token
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
      
      // Fetch user data if needed
      if (!user) {
        const userData = await authService.getUserProfile(response.userId);
        setUser(userData);
        await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
      }
      
      return response.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);
      
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser({
        id: response.userId,
        email,
        emailVerified: response.emailVerified
      });
      
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify({
        id: response.userId,
        email,
        emailVerified: response.emailVerified
      }));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const response = await authService.signup(email, password);
      
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);
      
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser({
        id: response.userId,
        email,
        emailVerified: false
      });
      
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify({
        id: response.userId,
        email,
        emailVerified: false
      }));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleGoogleSignIn = async (idToken) => {
    try {
      const response = await authService.googleAuth(idToken);
      
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, response.refreshToken);
      
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser({
        id: response.userId,
        ...response.user
      });
      
      await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify({
        id: response.userId,
        ...response.user
      }));
      
      return response;
    } catch (error) {
      console.error('Google sign-in error:', error);
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
      // Clear local storage
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
      
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    }
  };

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!accessToken || !refreshToken) return;

    // Refresh token 5 minutes before expiry
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
    signInWithGoogle: promptAsync,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};