import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { authService } from '../services/apiService';
import { API_GOOGLE_URL, REDIRECT_URI } from '../config/api';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Token storage keys
  const ACCESS_TOKEN_KEY = 'access_token';
  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_DATA_KEY = 'user_data';

  const redirectUri = makeRedirectUri({
    scheme: 'shelfie',
    useProxy: true,
  });

  console.log('Using redirect URI:', redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: REDIRECT_URI,
    androidClientId: API_GOOGLE_URL,
    iosClientId: API_GOOGLE_URL,
    webClientId: API_GOOGLE_URL,
    redirectUri: redirectUri,
    scopes: ['openid', 'profile', 'email'],
    responseType: ['id_token', 'token'],
    prompt: 'select_account',
  });

  // Load stored tokens on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Handle OAuth response
  useEffect(() => {
    handleAuthResponse();
  }, [response]);

  const handleAuthResponse = async () => {
    if (response?.type === 'success') {
      console.log("Auth Response:", response);
      console.log("ID Token:", response.params?.id_token);
      console.log("Access Token:", response.authentication?.accessToken);

      try {
        const idToken = response.params?.id_token ||
          response.authentication?.idToken ||
          response.authentication?.accessToken;

        if (idToken) {
          await handleGoogleSignIn(idToken);
        } else {
          console.error('No ID token found in response');
        }
      } catch (error) {
        console.error('Error handling auth response:', error);
      }
    } else if (response?.type === 'error') {
      console.error('Auth error:', response.error);

      if (response.error?.message) {
        alert(`Sign in failed: ${response.error.message}`);
      }
    }
  };

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
      if (!user && response.userId) {
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
      console.log('Sending ID token to backend:', idToken?.substring(0, 20));

      const response = await authService.googleAuth(idToken);

      console.log('Backend response:', response);

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

    // Refresh token 5 minutes before expiry (15min - 5min = 10min)
    const refreshInterval = setInterval(() => {
      refreshAccessToken(refreshToken);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, [accessToken, refreshToken]);

  // Enhanced Google sign in with error handling
  const signInWithGoogle = async () => {
    try {
      console.log('Request object:', request);
      console.log('Redirect URI:', redirectUri);

      if (!request) {
        console.error('Google Sign-In not ready. Request is null.');
        return;
      }

      const result = await promptAsync();
      console.log('Prompt result:', result);

      // The response handling is done in useEffect above
      return result;
    } catch (error) {
      console.error('Error during Google sign in:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    accessToken,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
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