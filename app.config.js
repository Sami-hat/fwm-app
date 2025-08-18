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
    extra: {
      GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
      GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
      GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      REDIRECT_URI: process.env.REDIRECT_URI,
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.sami.hat.shelfie",
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to take photos of food items for inventory management.",
        NSPhotoLibraryUsageDescription: "This app needs access to photo library to save food images.",
        NSFaceIDUsageDescription: "This app uses Face ID to secure your authentication tokens."
      }
    },
    android: {
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
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.googleusercontent.apps.653807450931-d24sr67p03e8m6n1ro4c2hno7dj7a104"
        }
      ],
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
            usesCleartextTraffic: true
          },
          ios: {
            flipper: true
          }
        }
      ],
      "expo-secure-store",
      "expo-web-browser"
    ]
  }
};