import React, { useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Icon } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { landingStyles } from '../styles/LandingPageStyles';


const LandingPage = () => {
  const navigation = useNavigation();
  const { isAuthenticated, signInWithGoogle } = useAuth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Home');
    }
  }, [isAuthenticated, navigation]);

  const handleGoogleSignIn = async () => {
    console.log('Starting Google Sign In');
    try {
      const result = await signInWithGoogle();
      console.log('Sign in result:', result);
    } catch (error) {
      console.error('Sign in failed:', error);
      Alert.alert('Sign In Failed', error.message || 'Please try again');
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
      >
        <Text style={landingStyles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        title="Continue with Google"
        icon={
          <Icon
            name="google"
            size={20}
            color="white"
            style={landingStyles.googleIcon}
          />
        }
        onPress={handleGoogleSignIn}
        buttonStyle={landingStyles.googleButton}
        titleStyle={landingStyles.buttonText}
      />

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