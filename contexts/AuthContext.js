import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { authService } from '../services/apiService';
import { GOOGLE_CLIENT_IDS } from '../config/googleAuth';

// Native Google Sign-In (for development builds)
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// Web-based auth (fallback for Expo Go)
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Only needed for Expo Go
WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isNativeSignInAvailable, setIsNativeSignInAvailable] = useState(false);

  const ACCESS_TOKEN_KEY = 'access_token';
  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_DATA_KEY = 'user_data';

  // Web-based auth setup (for Expo Go fallback)
  const redirectUri = makeRedirectUri({
    scheme: 'shelfie',
    useProxy: true
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_IDS.WEB_CLIENT_ID,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
  });

  // Initialize Google Sign-In for development builds
  useEffect(() => {
    const initGoogleSignIn = async () => {
      try {
        // Check if native module is available (development build)
        if (GoogleSignin) {
          await GoogleSignin.configure({
            webClientId: GOOGLE_CLIENT_IDS.WEB_CLIENT_ID,
            iosClientId: Platform.OS === 'ios' ? GOOGLE_CLIENT_IDS.IOS_CLIENT_ID : undefined,
            offlineAccess: true,
            forceCodeForRefreshToken: true,
            profileImageSize: 150,
          });
          
          setIsNativeSignInAvailable(true);
          console.log('Native Google Sign-In configured');
        }
      } catch (error) {
        console.log('Native Google Sign-In not available, using web-based auth');
        setIsNativeSignInAvailable(false);
      }
    };

    initGoogleSignIn();
    loadStoredAuth();
  }, []);

  // Handle web-based OAuth response (Expo Go)
  useEffect(() => {
    if (response?.type === 'success') {
      handleWebAuthResponse(response);
    }
  }, [response]);

  const handleWebAuthResponse = async (response) => {
    try {
      const idToken = response.params?.id_token;
      
      if (!idToken) {
        throw new Error('No ID token received');
      }

      const result = await authService.googleAuth(idToken);
      await handleAuthSuccess(result);
    } catch (error) {
      console.error('Web auth error:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (isNativeSignInAvailable) {
        // Use native Google Sign-In (development build)
        console.log('Using native Google Sign-In');
        
        // Check if device supports Google Play Services
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        
        // Sign in
        const userInfo = await GoogleSignin.signIn();
        console.log('Native sign-in successful:', userInfo.user.email);
        
        // Get the ID token
        const tokens = await GoogleSignin.getTokens();
        
        // Send to backend
        const result = await authService.googleAuth(tokens.idToken);
        await handleAuthSuccess(result);
        
        return result;
      } else {
        // Fallback to web-based auth (Expo Go)
        console.log('Using web-based Google Sign-In');
        
        if (!request) {
          alert('Google Sign-In is initializing. Please try again.');
          return;
        }
        
        const result = await promptAsync();
        return result;
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Sign-in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Google Play Services not available');
      } else {
        alert('Sign-in failed. Please try again.');
      }
      
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
      // Sign out from Google if using native sign-in
      if (isNativeSignInAvailable && GoogleSignin) {
        try {
          await GoogleSignin.signOut();
        } catch (error) {
          console.error('Google sign-out error:', error);
        }
      }

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
    }, 10 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [accessToken, refreshToken]);

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
    isEmailVerified: user?.emailVerified || false,
    isNativeSignInAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};