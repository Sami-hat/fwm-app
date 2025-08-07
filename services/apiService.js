import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from "../config/api";

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
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
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
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (email, password) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
      method: "POST",
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

  add: async (userId, name, quantity, barcode, expiry_date) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.INVENTORY_ADD}`, {
      method: "POST",
      body: JSON.stringify({
        user: userId,
        name,
        quantity,
        barcode,
        expiry_date,
      }),
    });
  },

  delete: async (userId, itemId) => {
    const url = buildApiUrl(API_ENDPOINTS.INVENTORY_DELETE, {
      user: userId,
      id: itemId,
    });
    return apiRequest(url, { method: "DELETE" });
  },

  edit: async (userId, itemId, name, quantity, barcode, expiry_date) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.INVENTORY_EDIT}`, {
      method: "PUT",
      body: JSON.stringify({
        user: userId,
        id: itemId,
        name,
        quantity,
        barcode,
        expiry_date,
      }),
    });
  },
};

// Recipe Services
export const recipeService = {
  generate: async (ingredients, userId) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.RECIPES}`, {
      method: "POST",
      body: JSON.stringify({ ingredients, userId }),
    });
  },

  analyzeImage: async (imageUri) => {
    return apiRequest(`${API_BASE_URL}${API_ENDPOINTS.LOGMEAL}`, {
      method: "POST",
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
  // Open Food Facts
  searchOpenFoodFacts: async (barcode) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      if (!response.ok) throw new Error("OpenFoodFacts API failed");

      const result = await response.json();
      if (result.status === 1 && result.product) {
        return {
          source: "OpenFoodFacts",
          found: true,
          confidence: "high",
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
      return { source: "OpenFoodFacts", found: false };
    } catch (error) {
      throw new Error(`OpenFoodFacts: ${error.message}`);
    }
  },

  // UPC Item DB
  searchUPCItemDB: async (barcode) => {
    try {
      const response = await fetch(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`
      );

      if (!response.ok) throw new Error("UPCItemDB API failed");

      const result = await response.json();
      if (result.code === "OK" && result.items && result.items.length > 0) {
        const product = result.items[0];
        return {
          source: "UPCItemDB",
          found: true,
          confidence: "medium",
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
      return { source: "UPCItemDB", found: false };
    } catch (error) {
      throw new Error(`UPCItemDB: ${error.message}`);
    }
  },

  // Main search function
  search: async (barcode) => {
    console.log(`Searching for barcode: ${barcode} across UK databases...`);

    const startTime = Date.now();

    try {
      // Priority order
      const searchPromises = [
        barcodeService.searchOpenFoodFacts(barcode),
        barcodeService.searchUPCItemDB(barcode),
      ];

      // Run searches concurrently
      const results = await Promise.allSettled(searchPromises);

      const searchTime = Date.now() - startTime;
      console.log(`Barcode searches completed in ${searchTime}ms`);

      // Find best result (prioritised by confidence and data completeness)
      let bestResult = null;
      let highestScore = 0;

      for (const result of results) {
        if (result.status === "fulfilled" && result.value.found) {
          // Score results
          let score = 0;
          const product = result.value.product;

          if (result.value.source === "OpenFoodFacts") score += 30;
          else if (result.value.source === "BarcodeLookup") score += 25;
          else if (result.value.source === "UPCItemDB") score += 20;
          else score += 15;

          if (product.product_name) score += 10;
          if (product.brand) score += 5;
          if (product.image_url) score += 5;
          if (product.categories) score += 3;
          if (product.quantity) score += 2;

          if (score > highestScore) {
            highestScore = score;
            bestResult = result.value;
          }
        }
      }

      if (bestResult) {
        console.log(
          `Best result from ${bestResult.source} (score: ${highestScore})`
        );
        return bestResult;
      }

      // Log failures for debugging
      results.forEach((result, index) => {
        const sources = [
          "OpenFoodFacts",
          "UPCItemDB",
          "BarcodeLookup",
          "EAN Data",
        ];
        if (result.status === "rejected") {
          console.log(`${sources[index]} failed:`, result.reason.message);
        }
      });

      return {
        source: "None",
        found: false,
        product: null,
        searchTime: searchTime,
      };
    } catch (error) {
      console.error("Barcode search error:", error);
      throw new Error("Failed to search barcode databases");
    }
  },
};
