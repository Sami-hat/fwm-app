import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

class PushTokenService {
  async getDeviceId() {
    try {
      let deviceId = await AsyncStorage.getItem('deviceId');
      
      if (!deviceId) {
        const uniqueId = `${Platform.OS}-${Device.brand}-${Device.modelName}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        deviceId = uniqueId.replace(/\s+/g, '-');
        await AsyncStorage.setItem('deviceId', deviceId);
      }
      
      return deviceId;
    } catch (error) {
      console.error('Error getting device ID:', error);
      return `${Platform.OS}-temp-${Date.now()}`;
    }
  }

  async registerDevice(userId) {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return { success: false, reason: 'Not a physical device' };
      }

      const deviceId = await this.getDeviceId();
      
      const deviceInfo = {
        brand: Device.brand,
        modelName: Device.modelName,
        modelId: Device.modelId,
        deviceYearClass: Device.deviceYearClass,
        osName: Device.osName,
        osVersion: Device.osVersion,
        platformOS: Platform.OS,
        platformVersion: Platform.Version,
      };

      const projectId = Constants.expoConfig?.extra?.eas?.projectId 
        ?? Constants.easConfig?.projectId
        ?? 'unknown';

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.DEVICE_REGISTRATION}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            deviceId,
            platform: Platform.OS,
            projectId,
            deviceInfo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Device registered successfully:', result);
      
      await AsyncStorage.setItem('deviceRegistered', 'true');
      await AsyncStorage.setItem('deviceUserId', userId.toString());
      
      return result;
    } catch (error) {
      console.error('Error registering device:', error);
      return { success: false, error: error.message };
    }
  }

  async checkNotificationStatus(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.NOTIFICATION_STATUS}?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check notification status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking notification status:', error);
      return null;
    }
  }

  async unregisterDevice(userId) {
    try {
      const deviceId = await this.getDeviceId();
      
      // May need to add unregister as well, after testing
      
      await AsyncStorage.removeItem('deviceRegistered');
      await AsyncStorage.removeItem('deviceUserId');

      return { success: true };
    } catch (error) {
      console.error('Error unregistering device:', error);
      return { success: false, error: error.message };
    }
  }

  async isDeviceRegistered() {
    try {
      const registered = await AsyncStorage.getItem('deviceRegistered');
      return registered === 'true';
    } catch (error) {
      return false;
    }
  }
}

export default new PushTokenService();