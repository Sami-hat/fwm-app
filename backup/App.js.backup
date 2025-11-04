import React from 'react';
import * as Linking from 'expo-linking';
import { AuthProvider } from './contexts/AuthContext';
import { Tabs } from './components/Tabs';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    // Handle deep link
    const handleDeepLink = (url) => {
      const { hostname, path, queryParams } = Linking.parse(url);
      
      if (path === 'verify-email' && queryParams.token) {
        // Navigate to your verification screen
        navigation.navigate('EmailVerification', { 
          token: queryParams.token 
        });
      } else if (path === 'reset-password' && queryParams.token) {
        navigation.navigate('PasswordReset', { 
          token: queryParams.token 
        });
      }
    };

    // Check if app was opened from a deep link
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url);
    });

    // Listen for new deep links while app is open
    const subscription = Linking.addEventListener('url', event => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, [navigation]);

  return (
    <AuthProvider>
      <Tabs />
    </AuthProvider>
  );
}