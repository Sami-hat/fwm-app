import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';

// Base fetch function with error handling
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Auth Services
export const authService = {
  login: async (email, password) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (email, password) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getUserEmail: async (userId) => {
    const url = buildApiUrl(API_ENDPOINTS.EMAIL, { user: userId });
    return apiRequest(url);
  },
};

// Inventory Services
export const inventoryService = {
  getAll: async (userId) => {
    const url = buildApiUrl(API_ENDPOINTS.INVENTORY, { user: userId });
    return apiRequest(url);
  },

  getNames: async (userId) => {
    const url = buildApiUrl(API_ENDPOINTS.INVENTORY_NAMES, { user: userId });
    return apiRequest(url);
  },

  add: async (userId, name, quantity, barcode) => {
    const url = buildApiUrl(API_ENDPOINTS.INVENTORY_ADD, { 
      user: userId, 
      name, 
      quantity, 
      barcode 
    });
    return apiRequest(url, { method: 'POST' });
  },

  delete: async (userId, itemId) => {
    const url = buildApiUrl(API_ENDPOINTS.INVENTORY_DELETE, { 
      user: userId, 
      id: itemId 
    });
    return apiRequest(url, { method: 'DELETE' });
  },

  edit: async (userId, itemId, name, quantity, barcode) => {
    const url = buildApiUrl(API_ENDPOINTS.INVENTORY_EDIT, { 
      user: userId, 
      id: itemId, 
      name, 
      quantity, 
      barcode 
    });
    return apiRequest(url, { method: 'POST' });
  },
};

// Recipe Services
export const recipeService = {
  generate: async (ingredients, userId) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.RECIPES}`, {
      method: 'POST',
      body: JSON.stringify({ ingredients, userId }),
    });
  },

  analyzeImage: async (imageUri) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.LOGMEAL}`, {
      method: 'POST',
      body: JSON.stringify({ imageUri }),
    });
  },
};

// Preferences Services
export const preferencesService = {
  get: async (userId) => {
    const url = buildApiUrl(API_ENDPOINTS.PREFERENCES, { user: userId });
    return apiRequest(url);
  },

  update: async (userId, preferences) => {
    const url = buildApiUrl(API_ENDPOINTS.PREFERENCES, { user: userId });
    return apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },
};