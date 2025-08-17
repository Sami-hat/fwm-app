const getBaseApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return `${process.env.EXPO_PUBLIC_API_URL}/api`;
  }

  // Development fallback
  if (__DEV__) {
    return "http://localhost:3000";
  }

  // Production fallback
  throw new Error(
    "Base API URL not configured. Please set EXPO_PUBLIC_API_URL environment variable.",
  );
};

const getGoogleApiUrl = () => {
  if (process.env.GOOGLE_CLIENT_ID) {
    return process.env.GOOGLE_CLIENT_ID
  };
}

const getRedirectUri = () => {
    if (process.env.REDIRECT_URI) {
    return process.env.REDIRECT_URI
  };
}

export const API_BASE_URL = getBaseApiUrl();

export const API_GOOGLE_URL = getGoogleApiUrl();

export const REDIRECT_URI = getRedirectUri();

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",

  // OAuth
  GOOGLE: "/auth/google",

  // User
  EMAIL: "/email",
  PREFERENCES: "/preferences",

  // Inventory
  INVENTORY: "/inventory",

  // Recipes & AI
  RECIPES: "/recipes",
  LOGMEAL: "/logmeal",
  SAVED_RECIPES: "/saved-recipes",

  // Notifications
  DEVICE_REGISTRATION: "/api/device-registration",
  NOTIFICATION_STATUS: "/api/notification-status",
  TEST_NOTIFICATION: "/api/test-notification",
  TRIGGER_EXPIRY_CHECK: "/api/trigger-expiry-check",
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint, queryParams = {}) => {
  const url = new URL(API_BASE_URL + endpoint);

  // Add query parameters if provided
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] !== undefined && queryParams[key] !== null) {
      url.searchParams.append(key, queryParams[key]);
    }
  });

  return url.toString();
};
