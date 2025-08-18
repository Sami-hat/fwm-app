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
            await logout(true);
            setIndex(0);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={settingsStyles.safeAreaView}>
      <View style={settingsStyles.container}>
        <Text h3 style={settingsStyles.title}>Settings</Text>
        
        {user && (
          <View style={settingsStyles.userInfoContainer}>
            <Text>Email: {user.email}</Text>
            {!isEmailVerified && (
              <Text style={settingsStyles.emailVerificationText}>Email not verified</Text>
            )}
          </View>
        )}

        <Button
          title="Logout"
          onPress={handleLogout}
          buttonStyle={settingsStyles.logoutButton}
          titleStyle={settingsStyles.buttonText}
        />
        
        <Button
          title="Logout from All Devices"
          onPress={handleLogoutAllDevices}
          buttonStyle={settingsStyles.logoutAllButton}
          titleStyle={settingsStyles.buttonText}
        />
      </View>
    </SafeAreaView>
  );
};

export default SettingsPage;