const getBaseApiUrl = () => {
  // Use env var if available
  if (process.env.EXPO_PUBLIC_API_URL) {
    return `${process.env.EXPO_PUBLIC_API_URL}/api`;
  }

  // Development fallback
  if (__DEV__) {
    return "http://localhost:3000";
  }

  // Production fallback
  throw new Error(
    "Base API URL not configured. Please set EXPO_PUBLIC_API_URL environment variable."
  );
};

const getBarcodeApiUrl = () => {
  // Use env var if available
  if (process.env.OPEN_FOOD_FACTS_API_URL) {
    return process.env.OPEN_FOOD_FACTS_API_URL;
  }

  // Development fallback
  if (__DEV__) {
    return "http://localhost:3000";
  }

  // Production fallback
  throw new Error(
    "Barcode API URL not configured. Please set BARCODE_API_URL environment variable."
  );
};

export const API_BASE_URL = getBaseApiUrl();

export const API_BARCODE_URL = getBarcodeApiUrl();

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/login",
  SIGNUP: "/signup",

  // User
  EMAIL: "/email",
  PREFERENCES: "/preferences",

  // Inventory
  INVENTORY: "/inventory",
  INVENTORY_ADD: "/inventory/add",
  INVENTORY_DELETE: "/inventory/delete",
  INVENTORY_EDIT: "/inventory/edit",
  INVENTORY_NAMES: "/inventory/names",

  // Recipes & AI
  RECIPES: "/recipes",
  LOGMEAL: "/logmeal",
  SAVED_RECIPES: '/saved-recipes',

  // Notifications
  NOTIFICATIONS: "/notifications",
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
