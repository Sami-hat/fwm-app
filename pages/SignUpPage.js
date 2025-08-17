import React, { useState } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { signUpStyles } from '../styles/SignUpPageStyles';

const SignUpPage = () => {
  const navigation = useNavigation();
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await signUpWithEmail(email.trim(), password);
      
      Alert.alert(
        'Success!',
        'Your account has been created. Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.error('Signup error:', error);

      if (error.message.includes('already exists')) {
        setError('An account with this email already exists');
      } else if (error.message.includes('Too many')) {
        setError(error.message);
      } else if (error.message.includes('Network')) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={signUpStyles.container}>
      <Text h3 style={signUpStyles.title}>
        Sign Up
      </Text>

      <Input
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        leftIcon={{
          type: 'font-awesome',
          name: 'envelope',
          color: '#52B788',
          size: 20,
        }}
        leftIconContainerStyle={signUpStyles.leftIconContainer}
        inputContainerStyle={signUpStyles.inputContainer}
        inputStyle={signUpStyles.inputText}
        onChangeText={setEmail}
        errorMessage={error && error.includes('email') ? error : ''}
      />

      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        leftIcon={{
          type: 'font-awesome',
          name: 'lock',
          color: '#52B788',
          size: 22,
        }}
        leftIconContainerStyle={signUpStyles.leftIconContainer}
        inputContainerStyle={signUpStyles.inputContainer}
        inputStyle={signUpStyles.inputText}
        onChangeText={setPassword}
        errorMessage={error && error.includes('Password') ? error : ''}
      />

      <Input
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        leftIcon={{
          type: 'font-awesome',
          name: 'lock',
          color: '#52B788',
          size: 22,
        }}
        leftIconContainerStyle={signUpStyles.leftIconContainer}
        inputContainerStyle={signUpStyles.inputContainer}
        inputStyle={signUpStyles.inputText}
        onChangeText={setConfirmPassword}
        errorMessage={error && error.includes('match') ? error : ''}
      />

      <Text style={signUpStyles.passwordHint}>
        Password must contain at least 8 characters, including uppercase, lowercase, number, and special character
      </Text>

      <Button
        title="Sign Up"
        onPress={handleSignup}
        buttonStyle={signUpStyles.signupButton}
        titleStyle={signUpStyles.buttonTitle}
        loading={loading}
        disabled={loading}
      />

      <Button
        style={{ paddingTop: 10 }}
        title="Back to Home"
        type="clear"
        titleStyle={signUpStyles.backText}
        onPress={() => navigation.goBack()}
      />

      {error && !error.includes('email') && !error.includes('Password') && !error.includes('match') ? (
        <Text style={signUpStyles.errorText}>{error}</Text>
      ) : null}
    </SafeAreaView>
  );
};

export default SignUpPage;