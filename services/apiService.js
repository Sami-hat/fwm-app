import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from '../config/api';
import * as SecureStore from 'expo-secure-store';

// API request builder
const apiRequest = async (url, options = {}) => {
  try {
    const accessToken = await SecureStore.getItemAsync('access_token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth header if token exists
    if (accessToken && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle token expiry
    if (response.status === 401 && !options.skipRetry) {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (refreshToken) {
        try {
          // Try to refresh token
          const refreshResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshResponse.ok) {
            const tokens = await refreshResponse.json();
            await SecureStore.setItemAsync('access_token', tokens.accessToken);
            await SecureStore.setItemAsync('refresh_token', tokens.refreshToken);

            // Retry original request with new token
            return apiRequest(url, { ...options, skipRetry: true });
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
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
      skipAuth: true
    });
  },

  signup: async (email, password) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true
    });
  },

  googleAuth: async (idToken) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.GOOGLE}`, {
      method: 'POST',
      body: JSON.stringify({ idToken }),
      skipAuth: true
    });
  },

  refreshToken: async (refreshToken) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true
    });
  },

  logout: async (refreshToken, logoutAll = false, userId = null) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken, logoutAll, userId }),
      skipAuth: true
    });
  },

  verifyEmail: async (token) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_EMAIL}`, {
      method: 'POST',
      body: JSON.stringify({ token }),
      skipAuth: true
    });
  },

  resendVerification: async (email) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.RESEND_VERIFICATION}`, {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true
    });
  },

  getUserProfile: async (userId) => {
    return apiRequest(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET'
    });
  }
};

// Inventory Services
export const inventoryService = {
  // GET all inventory items
  getAll: async (userId) => {
    const url = buildApiUrl(API_ENDPOINTS.INVENTORY, { userId });
    return apiRequest(url, {
      method: "GET",
    });
  },

  // GET inventory names only
  getNames: async (userId) => {
    const url = buildApiUrl(API_ENDPOINTS.INVENTORY, {
      userId: userId,
      names: "true",
    });
    return apiRequest(url, {
      method: "GET",
    });
  },

  // POST new inventory item
  add: async (userId, name, quantity, barcode, expiry_date) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.INVENTORY}`, {
      method: "POST",
      body: JSON.stringify({
        userId,
        name,
        quantity,
        barcode,
        expiry_date,
      }),
    });
  },

  // PUT inventory item
  edit: async (userId, id, name, quantity, barcode, expiry_date) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.INVENTORY}`, {
      method: "PUT",
      body: JSON.stringify({
        userId,
        id,
        name,
        quantity,
        barcode,
        expiry_date,
      }),
    });
  },

  // DELETE inventory item
  delete: async (userId, id) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.INVENTORY}`, {
      method: "DELETE",
      body: JSON.stringify({
        userId,
        id,
      }),
    });
  },
};

// Recipe Services
export const recipeService = {
  generate: async (userId, ingredients, action, currentRecipes) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.RECIPES}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredients,
        userId,
        action,
        currentRecipes
      })
    });
  },

  analyseImage: async (imageUri) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.LOGMEAL}`, {
      method: "POST",
      body: JSON.stringify({ imageUri }),
    });
  },

  getSaved: async (userId) => {
    const url = buildApiUrl(API_ENDPOINTS.SAVED_RECIPES, { userId });
    return apiRequest(url);
  },

  save: async (userId, recipe) => {
    const url = buildApiUrl(API_ENDPOINTS.SAVED_RECIPES, { userId });
    return apiRequest(url, {
      method: "POST",
      body: JSON.stringify(recipe),
    });
  },

  removeSaved: async (userId, recipeId) => {
    const url = buildApiUrl(API_ENDPOINTS.SAVED_RECIPES, { userId });
    return apiRequest(url, {
      method: "DELETE",
      body: JSON.stringify({ recipeId }),
    });
  },
};

// Preferences Services
export const preferencesService = {
  get: async (userId) => {
    const url = buildApiUrl(API_ENDPOINTS.PREFERENCES, { userId });
    return apiRequest(url);
  },

  update: async (userId, preferences) => {
    const url = buildApiUrl(API_ENDPOINTS.PREFERENCES, { userId });

    return apiRequest(url, {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  },
};

// Barcode Services
export const barcodeService = {
  // Open Food Facts
  searchOpenFoodFacts: async (barcode) => {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    if (!response.ok) throw new Error("OpenFoodFacts API failed");

    const result = await response.json();
    if (result.status === 1 && result.product) {
      return {
        source: "OpenFoodFacts",
        found: true,
        product: {
          product_name:
            result.product.product_name || result.product.product_name_en,
          quantity: result.product.quantity,
          brand: result.product.brands,
          image_url: result.product.image_url,
          categories: result.product.categories,
          ingredients: result.product.ingredients_text,
          nutriscore: result.product.nutriscore_grade,
          stores: result.product.stores,
        },
      };
    }
    throw new Error("Not found in OpenFoodFacts");
  },

  // UPC Item DB
  searchUPCItemDB: async (barcode) => {
    const response = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`
    );
    if (!response.ok) throw new Error("UPCItemDB API failed");

    const result = await response.json();
    if (result.code === "OK" && result.items?.length > 0) {
      const product = result.items[0];
      return {
        source: "UPCItemDB",
        found: true,
        product: {
          product_name: product.title,
          quantity: product.size,
          brand: product.brand,
          image_url: product.images?.[0],
          categories: product.category,
          description: product.description,
        },
      };
    }
    throw new Error("Not found in UPCItemDB");
  },

  // Main search function
  search: async (barcode) => {
    console.log(`Searching for barcode: ${barcode}...`);
    const startTime = Date.now();

    try {
      // Race APIs
      const result = await Promise.any([
        barcodeService.searchOpenFoodFacts(barcode),
        barcodeService.searchUPCItemDB(barcode),
      ]);

      const searchTime = Date.now() - startTime;
      console.log(
        `Found product from ${result.source} in ${searchTime}ms`
      );

      return result;
    } catch (error) {
      console.error("All barcode APIs failed:", error);
      return { source: "None", found: false, product: null };
    }
  },
};
