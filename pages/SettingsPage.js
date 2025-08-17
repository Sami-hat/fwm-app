import { settingsStyles } from '../styles/SettingsPageStyles';

import React from 'react';
import { View, SafeAreaView, Alert } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = ({ setIndex }) => {
  
  const { user, logout, isEmailVerified } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            setIndex(0); // Navigate back to landing page
          }
        }
      ]
    );
  };

  const handleLogoutAllDevices = async () => {
    Alert.alert(
      'Logout from All Devices',
      'This will log you out from all devices. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout All', 
          style: 'destructive',
          onPress: async () => {
            await logout(true); // true = logout from all devices
            setIndex(0);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text h3 style={{ marginBottom: 20 }}>Settings</Text>
      
      {user && (
        <View style={{ marginBottom: 20 }}>
          <Text>Email: {user.email}</Text>
          {!isEmailVerified && (
            <Text style={{ color: 'orange' }}>Email not verified</Text>
          )}
        </View>
      )}

      <Button
        title="Logout"
        onPress={handleLogout}
        buttonStyle={{ backgroundColor: '#d32f2f', marginBottom: 10 }}
      />
      
      <Button
        title="Logout from All Devices"
        onPress={handleLogoutAllDevices}
        buttonStyle={{ backgroundColor: '#b71c1c' }}
      />
    </SafeAreaView>
  );
};

export default SettingsPage;