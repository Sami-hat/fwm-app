import Constants from 'expo-constants';

const getGoogleClientIds = () => {
  const extra = Constants.expoConfig?.extra || {};
  
  return {
    WEB_CLIENT_ID: extra.GOOGLE_WEB_CLIENT_ID || process.env.GOOGLE_WEB_CLIENT_ID,
    ANDROID_CLIENT_ID: extra.GOOGLE_ANDROID_CLIENT_ID || process.env.GOOGLE_ANDROID_CLIENT_ID,
    IOS_CLIENT_ID: extra.GOOGLE_IOS_CLIENT_ID || process.env.GOOGLE_IOS_CLIENT_ID,
    EXPO_CLIENT_ID: extra.GOOGLE_EXPO_CLIENT_ID || process.env.GOOGLE_EXPO_CLIENT_ID,
  };
};

const GOOGLE_CLIENT_IDS = getGoogleClientIds();

const validateClientIds = () => {
  const requiredIds = ['WEB_CLIENT_ID'];
  const missingIds = requiredIds.filter(id => !GOOGLE_CLIENT_IDS[id]);
  
  if (missingIds.length > 0) {
    console.warn(`Missing Google client IDs: ${missingIds.join(', ')}`);
  }
  
  return missingIds.length === 0;
};

if (__DEV__) {
  validateClientIds();
  console.log('Environment variables:', {
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
    GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID,
    GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID,
    GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID,
  });
  
  console.log('Expo extra:', Constants.expoConfig?.extra);
  console.log('Final GOOGLE_CLIENT_IDS:', GOOGLE_CLIENT_IDS);
}

export { GOOGLE_CLIENT_IDS, validateClientIds };