import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';

// Base fetch function with error handling
const apiRequest = async (url, options = {}) => {
  try {
    console.log('Making API request to:', url); // Debug log

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {

      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (parseError) {

        const errorText = await response.text();
        console.log('Non-JSON error response:', errorText.substring(0, 200)); // Log first 200 chars
        errorMessage = `Server error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.log('Non-JSON response:', textResponse.substring(0, 200)); // Log first 200 chars
      throw new Error('Server returned non-JSON response');
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// External API request function for third-party services
const externalApiRequest = async (url, options = {}) => {
  try {

    const response = await fetch(url, {
      ...options,
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('External API Request failed:', error);
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

// Barcode Services
export const barcodeService = {
  search: async (barcode) => {
    try {

      // Use OpenFoodFacts API directly
      const result = await externalApiRequest(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      console.log('Barcode API result:', result);

      // Transform the response to match expected format
      if (result.status === 1 && result.product) {
        return {
          found: true,
          product: {
            product_name: result.product.product_name,
            quantity: result.product.quantity,
            brand: result.product.brands,
            image_url: result.product.image_url,
          }
        };
      } else {
        return {
          found: false,
          product: null
        };
      }
    } catch (error) {
      console.error('Barcode search failed:', error);
      throw new Error('Failed to search barcode database');
    }
  }
};