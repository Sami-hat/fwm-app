import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Platform } from 'react-native';
import pushTokenService from '../services/pushTokenService';
import * as Linking from 'expo-linking';

const NotificationManager = ({ userId }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(null);

  useEffect(() => {
    if (userId && userId >= 1) {
      setupNotifications();
    }
  }, [userId]);

  const setupNotifications = async () => {
    try {
      // Register device (not push token)
      const result = await pushTokenService.registerDevice(userId);
      
      if (result) {
        setIsRegistered(true);

        if (Platform.OS === 'ios') {
          Alert.alert(
            'Enable Notifications',
            'To receive expiry alerts, please enable notifications for this app in your iPhone Settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Open Settings', 
                onPress: () => Linking.openSettings()
              }
            ]
          );
        } else if (Platform.OS === 'android') {
          Alert.alert(
            'Enable Notifications',
            'To receive expiry alerts, please enable notifications for this app in your Android Settings.',
            [
              { text: 'OK' }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  // Poll for notification status
  useEffect(() => {
    if (!isRegistered) return;

    const interval = setInterval(async () => {
      const status = await pushTokenService.checkNotificationStatus(userId);
      if (status && status.hasExpiringItems) {
        setNotificationStatus(status);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isRegistered, userId]);

  return notificationStatus ? (
    <View style={{ padding: 10, backgroundColor: '#FFF3CD', borderRadius: 5 }}>
      <Text style={{ fontWeight: 'bold' }}>⚠️ Expiring Items Alert</Text>
      <Text>{notificationStatus.message}</Text>
    </View>
  ) : null;
};

export default NotificationManager;