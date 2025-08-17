import React, { useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { landingStyles } from '../styles/LandingPageStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    <View style={landingStyles.container}>
      <View style={landingStyles.banner}>
        <Text h3 style={landingStyles.welcomeText}>
          Welcome to Shelfie!
        </Text>
        <Text h5 style={landingStyles.welcomeText}>
          Please sign up or log in to access your profile.
        </Text>
      </View>

      <Button
        title="Sign Up with Email"
        onPress={() => navigation.navigate('SignUp')}
        buttonStyle={{
          ...landingStyles.button,
          backgroundColor: '#5295B7FF',
        }}
        titleStyle={landingStyles.buttonText}
      />

      <Button
        title="Log In with Email"
        onPress={() => navigation.navigate('Login')}
        buttonStyle={{
          ...landingStyles.button,
          backgroundColor: '#5295B7FF',
        }}
        titleStyle={landingStyles.buttonText}
      />

      <View style={landingStyles.divider}>
        <View style={landingStyles.dividerLine} />
        <Text style={landingStyles.dividerText}>OR</Text>
        <View style={landingStyles.dividerLine} />
      </View>

      <Button
        title="Continue with Google"
        icon={
          <Icon
            name="google"
            size={20}
            color="white"
            style={{ marginRight: 10 }}
          />
        }
        onPress={handleGoogleSignIn}
        buttonStyle={{
          ...landingStyles.button,
          backgroundColor: '#4285F4',
        }}
        titleStyle={landingStyles.buttonText}
      />

      <View style={landingStyles.statisticsBox}>
        <Text h3 style={landingStyles.statisticsTitle}>
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
    </View>
  );
};

export default LandingPage;