// screens/EmailVerificationScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function EmailVerificationScreen({ route, navigation }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Get token from deep link if available
  const tokenFromLink = route.params?.token;

  useEffect(() => {
    if (tokenFromLink) {
      // Automatically verify with token from deep link
      verifyEmail(tokenFromLink);
    }
  }, [tokenFromLink]);

  const verifyEmail = async (token) => {
    setIsVerifying(true);
    try {
      const response = await fetch('https://your-api.vercel.app/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token || verificationCode }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Email verified successfully!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid or expired verification code');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // If came from deep link, show verifying state
  if (tokenFromLink && isVerifying) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Verifying your email...</Text>
      </View>
    );
  }

  // Manual entry screen
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Verify Your Email</Text>
      <Text style={{ marginBottom: 20 }}>
        Enter the verification code from your email:
      </Text>
      <TextInput
        value={verificationCode}
        onChangeText={setVerificationCode}
        placeholder="Enter verification code"
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 10,
          marginBottom: 20,
          borderRadius: 4,
        }}
      />
      <Button
        title="Verify"
        onPress={() => verifyEmail(verificationCode)}
        disabled={isVerifying || !verificationCode}
      />
    </View>
  );
}