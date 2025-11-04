import 'dotenv/config';

export default {
  expo: {
    name: "shelfie",
    slug: "shelfie",
    scheme: "shelfie",
    version: "1.0.0",
    platforms: ["ios", "android"],
    orientation: "portrait",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    owner: "sami.hat", 
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    extra: {
      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
      GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
      GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      REDIRECT_URI: process.env.REDIRECT_URI,
      eas: {
        "projectId": "9a3feb72-9264-4226-8d4e-c724712dee32"
      },
    },
    ios: {
      associatedDomains: [
        "applinks:https://fwm-backend.vercel.app/"
      ],
      supportsTablet: true,
      bundleIdentifier: "com.sami.hat.shelfie",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to take photos of food items for inventory management.",
        NSPhotoLibraryUsageDescription: "This app needs access to photo library to save food images.",
        NSFaceIDUsageDescription: "This app uses Face ID to secure your authentication tokens."
      }
    },
    android: {
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "shelfie"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        }
      ],
      permissions: [
        "android.permission.CAMERA",
        "android.permission.CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ],
      package: "com.sami.hat.shelfie"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          photosPermission: "Allow $(PRODUCT_NAME) to access your photos",
          savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos",
          microphonePermissions: "Allow $(PRODUCT_NAME) to access your microphone",
          isAccessMediaLocationEnabled: "true",
          recordAudioAndroid: false
        }
      ],
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
            
          },
          ios: {
            flipper: true,
            deploymentTarget: "15.1",
          }
        }
      ],
      "expo-secure-store"
    ]
  }
};