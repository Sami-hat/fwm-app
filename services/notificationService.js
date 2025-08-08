import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Config
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Register for push notifications
  async registerForPushNotifications(userId) {
    try {
      if (!Device.isDevice) {
        console.log("Laptop emulator ignored");
        return null;
      }

      // Get existing permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Ask for permission if not granted
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification");
        return null;
      }

      // Get the token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      
      console.log("Push token:", token.data);

      // Save token 
      await this.savePushToken(userId, token.data);

      // Configure Android channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("expiry-notifications", {
          name: "Expiry Notifications",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token.data;
    } catch (error) {
      console.error("Error registering for push notifications:", error);
      return null;
    }
  }

  // Save push token to backend
  async savePushToken(userId, token) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.NOTIFICATIONS}?action=register&user=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pushToken: token,
          platform: Platform.OS,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save push token");
      }

      // Save locally as backup
      await AsyncStorage.setItem("pushToken", token);
    } catch (error) {
      console.error("Error saving push token:", error);
    }
  }

  // Schedule local notification for expiry warning
  async scheduleExpiryNotification(itemName, daysUntilExpiry) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Item Expiring Soon! ⏰",
          body: `${itemName} will expire in ${daysUntilExpiry} days`,
          data: { type: "expiry_warning", item: itemName },
        },
        trigger: {
          seconds: 60, // Show after 1 minute for testing
          // For production, use:
          // seconds: (daysUntilExpiry - 1) * 24 * 60 * 60, // Day before expiry
        },
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  }

  // Check for expiring items locally
  async checkExpiringItems(inventory) {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    const expiringItems = inventory.filter(item => {
      if (!item.expiry_date) return false;
      
      const expiryDate = new Date(item.expiry_date);
      return expiryDate >= today && expiryDate <= threeDaysFromNow;
    });

    if (expiringItems.length > 0) {
      const itemText = expiringItems.length === 1 
        ? `${expiringItems[0].name} is` 
        : `${expiringItems.length} items are`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Items Expiring Soon! ⏰",
          body: `${itemText} close to expiry. Check your inventory!`,
          data: { 
            type: "expiry_warning",
            count: expiringItems.length,
            items: expiringItems.map(i => i.name)
          },
        },
        trigger: null, // Show immediately
      });
    }

    return expiringItems;
  }

  // Set up notification listeners
  setupNotificationListeners(navigation) {
    // Handle notifications when app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
    });

    // Handle notification taps
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification tapped:", response);
      
      const data = response.notification.request.content.data;
      if (data.type === "expiry_warning") {
        // Navigate to inventory page when expiry notification is tapped
        navigation.navigate("entries");
      }
    });
  }

  // Clean up listeners
  removeNotificationListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Get scheduled notifications
  async getScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export default new NotificationService();