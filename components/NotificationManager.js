import { notificationStyles } from "../styles/NotificationPageStyles";

import React, { useEffect, useState } from 'react';
import { View, Text, notificationStylesheet, Alert, TouchableOpacity, Linking, Platform } from 'react-native';
import pushTokenService from '../services/pushTokenService';
import { inventoryService } from '../services/apiService';

const NotificationManager = ({ userId, navigation }) => {
  const [notificationStatus, setNotificationStatus] = useState(null);
  const [expiringItems, setExpiringItems] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Register device on mount
  useEffect(() => {
    if (userId && userId >= 1) {
      setupNotifications();
    }
  }, [userId]);

  // Check for expiring items periodically
  useEffect(() => {
    if (!isRegistered || !userId) return;

    // Check immediately
    checkExpiringItems();

    // Then check every 5 minutes while app is open
    const interval = setInterval(() => {
      checkExpiringItems();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isRegistered, userId]);

  const setupNotifications = async () => {
    try {
      // Register device with backend
      const result = await pushTokenService.registerDevice(userId);
      
      if (result.success) {
        setIsRegistered(true);
        console.log('Notification setup complete');
        
        // Show one-time setup message
        if (Platform.OS === 'ios') {
          Alert.alert(
            '📱 Notifications Setup',
            'To receive expiry alerts when the app is closed, please enable notifications in Settings.',
            [
              { text: 'Not Now', style: 'cancel' },
              { 
                text: 'Open Settings', 
                onPress: () => Linking.openSettings()
              }
            ]
          );
        }
      } else {
        console.log('Device registration failed:', result.reason);
      }
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const checkExpiringItems = async () => {
    try {
      // Get inventory from backend
      const inventory = await inventoryService.getAll(userId);
      
      // Check for items expiring in next 3 days
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);
      
      const expiring = inventory.filter(item => {
        if (!item.expiry_date) return false;
        
        // Parse date based on format
        let expiryDate;
        if (item.formatted_expiry_date) {
          // Parse DD/MM/YYYY format
          const [day, month, year] = item.formatted_expiry_date.split('/');
          expiryDate = new Date(year, month - 1, day);
        } else {
          expiryDate = new Date(item.expiry_date);
        }
        
        return expiryDate >= today && expiryDate <= threeDaysFromNow;
      });
      
      if (expiring.length > 0) {
        setExpiringItems(expiring);
        setShowBanner(true);
        
        // Also check backend notification status
        const status = await pushTokenService.checkNotificationStatus(userId);
        if (status) {
          setNotificationStatus(status);
        }
      }
    } catch (error) {
      console.error('Error checking expiring items:', error);
    }
  };

  const handleBannerPress = () => {
    // Navigate to inventory page
    if (navigation) {
      navigation.navigate('entries');
    }
    setShowBanner(false);
  };

  const dismissBanner = () => {
    setShowBanner(false);
  };

  // Don't render anything if no expiring items
  if (!showBanner || expiringItems.length === 0) {
    return null;
  }

  // Calculate most urgent expiry
  const getMostUrgent = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let mostUrgent = null;
    let daysUntil = Infinity;
    
    expiringItems.forEach(item => {
      if (item.days_until_expiry !== undefined) {
        if (item.days_until_expiry < daysUntil) {
          daysUntil = item.days_until_expiry;
          mostUrgent = item;
        }
      }
    });
    
    if (daysUntil === 0) return { text: 'TODAY', urgent: true };
    if (daysUntil === 1) return { text: 'TOMORROW', urgent: true };
    return { text: `${daysUntil} DAYS`, urgent: false };
  };

  const urgency = getMostUrgent();

  return (
    <TouchableOpacity 
      style={[notificationStyles.banner, urgency.urgent && notificationStyles.urgentBanner]}
      onPress={handleBannerPress}
      activeOpacity={0.9}
    >
      <View style={notificationStyles.bannerContent}>
        <Text style={notificationStyles.bannerIcon}>⚠️</Text>
        <View style={notificationStyles.bannerText}>
          <Text style={notificationStyles.bannerTitle}>
            {expiringItems.length} {expiringItems.length === 1 ? 'item' : 'items'} expiring {urgency.text}
          </Text>
          <Text style={notificationStyles.bannerSubtitle}>
            {expiringItems.slice(0, 2).map(i => i.name).join(', ')}
            {expiringItems.length > 2 && '...'}
          </Text>
        </View>
        <TouchableOpacity onPress={dismissBanner} style={notificationStyles.dismissButton}>
          <Text style={notificationStyles.dismissText}>✕</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationManager;