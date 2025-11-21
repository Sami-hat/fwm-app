import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { landingStyles } from '../styles/LandingPageStyles';

const LandingPage = () => {
  const navigation = useNavigation();
  const { isAuthenticated, signInWithGoogle } = useAuth();
  const currentYear = new Date().getFullYear();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Home');
    }
  }, [isAuthenticated, navigation]);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in failed:', error);
      Alert.alert('Sign In Failed', error.message || 'Please try again');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={landingStyles.container}>
      <View style={landingStyles.banner}>
        <Text style={landingStyles.welcomeText}>
          Welcome to Shelfie!
        </Text>
        <Text style={landingStyles.welcomeText}>
          Please sign up or log in to access your profile.
        </Text>
      </View>

      <TouchableOpacity
        style={landingStyles.signUpButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={landingStyles.buttonText}>Sign Up with Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={landingStyles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={landingStyles.buttonText}>Log In with Email</Text>
      </TouchableOpacity>

      <View style={landingStyles.divider}>
        <View style={landingStyles.dividerLine} />
        <Text style={landingStyles.dividerText}>OR</Text>
        <View style={landingStyles.dividerLine} />
      </View>

      <TouchableOpacity
        style={landingStyles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        <Text style={landingStyles.buttonText}>
          {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </TouchableOpacity>

      <View style={landingStyles.statisticsBox}>
        <Text style={landingStyles.statisticsTitle}>
          Your Statistics
        </Text>
        <Text style={landingStyles.statisticsText}>
          Sign in to access your grocery list, make amendments, and find out to
          effectively use the food products you own!
        </Text>
      </View>

      <View style={landingStyles.footer}>
        <Text style={landingStyles.footerTextLeft}>
          © {currentYear} Shelfie.
        </Text>
        <Text style={landingStyles.footerTextRight}>
          All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LandingPage;