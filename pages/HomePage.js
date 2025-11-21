import { homeStyles } from "../styles/HomePageStyles";
import {
  recipeService,
  inventoryService,
  preferencesService,
} from "../services/apiService";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useNavigation } from "@react-navigation/native";
import { useCache } from '../hooks/useCache';
import { useCancellableRequest } from '../hooks/useCancellableRequest';
import {
  SafeAreaView,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

import { useAuth } from '../contexts/AuthContext';

// Memoised component for suggested recipe items
const SuggestedRecipeItem = memo(({ item, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    }}
  >
    <Text style={{
      fontSize: 16,
      fontWeight: '500',
      color: '#333'
    }}>
      {item.recipe_name}
    </Text>
  </TouchableOpacity>
));

// Memoised component for saved recipe items
const SavedRecipeItem = memo(({ item, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    }}
  >
    <Text style={{
      fontSize: 20,
      color: '#FFD700',
      marginRight: 12
    }}>
      ⭐
    </Text>
    <View style={{ flex: 1 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '500',
        color: '#333'
      }}>
        {item.recipe_name}
      </Text>
    </View>
  </TouchableOpacity>
));

// Home Page, User is signed in
const HomePage = ({ setRecipe }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const userId = user?.id;

  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();

  // Caching and cancellation hooks
  const { getCached, setCached, invalidateByPattern } = useCache(5); // 5 minute TTL
  const { createCancellableRequest, cancelPendingRequests } = useCancellableRequest();

  const [ingredients, setIngredients] = useState("");
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [hasGeneratedRecipes, setHasGeneratedRecipes] = useState(false);
  const [lastUserId, setLastUserId] = useState(null);

  // Navigate to landing if not logged in
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigation.navigate('Landing');
    }
  }, [isAuthenticated, loading, navigation]);

  // Load data when userId changes
  useEffect(() => {
    if (userId >= 1 && userId !== lastUserId) {
      setLastUserId(userId);
      loadInitialData();
    }
  }, [userId]);

  // Reload on navigation focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (userId >= 1 && userId === lastUserId && lastUserId !== null) {
        loadInventory();
        loadPreferences();
        loadSavedRecipes();
      }
    });

    return unsubscribe;
  }, [navigation, userId, lastUserId, loadInventory, loadPreferences, loadSavedRecipes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPendingRequests();
    };
  }, [cancelPendingRequests]);

  const loadInitialData = async () => {
    if (userId >= 1) {
      loadInventory();
      loadPreferences();
      loadSavedRecipes();

      setSuggestedRecipes([]);
      setHasGeneratedRecipes(false);
    }
  };

  const loadInventory = useCallback(async () => {
    if (userId < 1) return;

    const cacheKey = `inventory_names_${userId}`;
    const cached = getCached(cacheKey);

    if (cached) {
      setIngredients(cached);
      return;
    }

    try {
      const cancellableRequest = createCancellableRequest(async () => {
        return await inventoryService.getNames(userId);
      });

      const data = await cancellableRequest();
      if (data) {
        const ingredientsString = data.join(", ");
        setIngredients(ingredientsString);
        setCached(cacheKey, ingredientsString);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setIngredients("");
    }
  }, [userId, getCached, setCached, createCancellableRequest]);

  const loadPreferences = useCallback(async () => {
    if (userId < 1) return;

    const cacheKey = `preferences_${userId}`;
    const cached = getCached(cacheKey);

    if (cached) {
      setPreferences(cached);
      return;
    }

    try {
      const cancellableRequest = createCancellableRequest(async () => {
        return await preferencesService.get(userId);
      });

      const userPrefs = await cancellableRequest();
      if (userPrefs !== null) {
        const prefs = userPrefs || {};
        setPreferences(prefs);
        setCached(cacheKey, prefs);
      }
    } catch (error) {
      console.log("Error loading preferences:", error);
      setPreferences({});
    }
  }, [userId, getCached, setCached, createCancellableRequest]);

  const loadSavedRecipes = useCallback(async () => {
    if (userId < 1) return;

    const cacheKey = `saved_recipes_${userId}`;
    const cached = getCached(cacheKey);

    if (cached) {
      setSavedRecipes(cached);
      return;
    }

    setIsLoadingSaved(true);
    try {
      const cancellableRequest = createCancellableRequest(async () => {
        return await recipeService.getSaved(userId);
      });

      const saved = await cancellableRequest();
      if (saved) {
        const parsedRecipes = saved.map((recipe) => ({
          ...recipe,
          itemId: `saved-${userId}-${recipe.id}`,
          ingredients_needed:
            typeof recipe.ingredients_needed === "string"
              ? JSON.parse(recipe.ingredients_needed)
              : recipe.ingredients_needed,
          instructions:
            typeof recipe.instructions === "string"
              ? JSON.parse(recipe.instructions)
              : recipe.instructions,
        }));
        setSavedRecipes(parsedRecipes);
        setCached(cacheKey, parsedRecipes);
      }
    } catch (error) {
      console.error("Error loading saved recipes:", error);
      setSavedRecipes([]);
    }
    setIsLoadingSaved(false);
  }, [userId, getCached, setCached, createCancellableRequest]);

  const generateRecipes = useCallback(async (action) => {
    if (!ingredients || ingredients.length === 0 || isLoadingRecipes) {
      return;
    }

    setIsLoadingRecipes(true);
    try {
      const recipesList = await recipeService.generate(
        userId,
        ingredients,
        action,
        action === "refresh" ? suggestedRecipes.map(r => r.recipe_name) : []
      );

      if (Array.isArray(recipesList)) {
        const recipesWithIds = recipesList.map((recipe, index) => ({
          ...recipe,
          itemId: `suggested-${recipe.id || index}-${Date.now()}`,
        }));

        if (action === "add") {
          // Add new recipes to existing ones
          setSuggestedRecipes(prevRecipes => [...prevRecipes, ...recipesWithIds]);
        } else {
          // Replace recipes
          setSuggestedRecipes(recipesWithIds);
        }
        setHasGeneratedRecipes(true);
      } else {
        if (action !== "add") {
          setSuggestedRecipes([]);
        }
      }
    } catch (error) {
      console.error("Recipe generation error:", error);
      if (action !== "add") {
        setSuggestedRecipes([]);
      }
    }
    setIsLoadingRecipes(false);
  }, [userId, ingredients, isLoadingRecipes, suggestedRecipes]);

  const handleAddMore = useCallback(() => {
    generateRecipes("add");
  }, [generateRecipes]);

  const handleRefreshRecipes = useCallback(() => {
    generateRecipes("refresh");
  }, [generateRecipes]);

  const handlePreferencesPress = useCallback(() => {
    navigation.navigate("Preferences");
  }, [navigation]);

  // Memoised preferences display text (expensive string manipulation)
  const preferencesDisplayText = useMemo(() => {
    if (!preferences || Object.keys(preferences).length === 0) return null;

    return Object.entries(preferences)
      .filter(([key, value]) => value === true && key.startsWith("is_"))
      .map(([key]) =>
        key
          .replace(/^is_|_/g, " ")
          .trim()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      )
      .join(", ") || "None";
  }, [preferences]);

  // Memoised render functions for FlatList
  const renderSuggestedRecipe = useCallback(({ item }) => {
    const handlePress = () => {
      setRecipe(item);
      navigation.navigate("Recipe");
    };
    return <SuggestedRecipeItem item={item} onPress={handlePress} />;
  }, [setRecipe, navigation]);

  const renderSavedRecipe = useCallback(({ item }) => {
    const handlePress = () => {
      setRecipe(item);
      navigation.navigate("Recipe");
    };
    return <SavedRecipeItem item={item} onPress={handlePress} />;
  }, [setRecipe, navigation]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated || !userId) {
    return null;
  }

  // Show validated profile information
  return (
    <SafeAreaView style={homeStyles.container}>
      <View>
        <View style={homeStyles.buttonContainer}>
          {/* Scan Barcode */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Scanner")}
            style={[
              homeStyles.button,
              { 
                backgroundColor: "#B8528A",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                marginBottom: 10,
              }
            ]}
          >
            <Text style={[homeStyles.buttonText, { marginRight: 10 }]}>
              Scan Barcode
            </Text>
            <Feather name="grid" size={24} color="white" />
          </TouchableOpacity>

          {/* Take Image */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Camera")}
            style={[
              homeStyles.button,
              { 
                backgroundColor: "#D8A052",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
              }
            ]}
          >
            <Text style={[homeStyles.buttonText, { marginRight: 10 }]}>
              Take Image
            </Text>
            <Feather name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Preferences Display */}
        {preferencesDisplayText && (
          <View style={homeStyles.preferencesDisplay}>
            <Text style={homeStyles.preferencesTitle}>
              Active Dietary Preferences:
            </Text>
            <Text style={homeStyles.preferencesText}>
              {preferencesDisplayText}
            </Text>
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={handlePreferencesPress}
            >
              <AntDesign name="edit" size={24} color="#52B788" />
            </TouchableOpacity>
          </View>
        )}

        {/* Suggested Recipes */}
        <View style={{ maxHeight: windowHeight * 0.35 }}>
          <Text style={homeStyles.header}>
            Suggested Recipes:
          </Text>

          {isLoadingRecipes ? (
            <View style={homeStyles.emptyText}>
              <ActivityIndicator size="large" color="#52B788" />
              <Text style={{ marginTop: 10 }}>Finding recipes...</Text>
            </View>
          ) : suggestedRecipes.length > 0 ? (
            <>
              <FlatList
                data={suggestedRecipes}
                keyExtractor={(item) => item.itemId}
                renderItem={renderSuggestedRecipe}
              />
              <View style={homeStyles.recipeActionButtonContainer}>
                <TouchableOpacity
                  onPress={handleAddMore}
                  style={[
                    homeStyles.recipeActionButton,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      borderColor: '#52B788',
                      borderRadius: 6,
                      marginRight: 8,
                    }
                  ]}
                  disabled={isLoadingRecipes}
                >
                  <Feather
                    name="plus-circle"
                    size={18}
                    color="#52B788"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[
                    homeStyles.recipeActionButtonText,
                    { color: '#52B788' }
                  ]}>
                    Add 3 More
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRefreshRecipes}
                  style={[
                    homeStyles.recipeActionButton,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderWidth: 1,
                      borderColor: '#4A90E2',
                      borderRadius: 6,
                    }
                  ]}
                  disabled={isLoadingRecipes}
                >
                  <Feather
                    name="refresh-cw"
                    size={18}
                    color="#4A90E2"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={[
                    homeStyles.recipeActionButtonText,
                    { color: '#4A90E2' }
                  ]}>
                    Refresh All
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : ingredients.length === 0 ? (
            <View style={homeStyles.emptyText}>
              <Text>No ingredients in inventory.</Text>
              <Text>Add items to generate recipes!</Text>
            </View>
          ) : (
            <View style={homeStyles.emptyText}>
              {hasGeneratedRecipes ? (
                <>
                  <Text style={{ marginBottom: 10 }}>
                    No recipes found. Try again?
                  </Text>
                  <TouchableOpacity
                    onPress={() => generateRecipes("generate")}
                    style={[
                      homeStyles.generateRecipeButton,
                      {
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderWidth: 1,
                        borderColor: '#52B788',
                        borderRadius: 6,
                      }
                    ]}
                  >
                    <Text style={[
                      homeStyles.generateRecipeButtonText,
                      { color: '#52B788' }
                    ]}>
                      Retry
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => generateRecipes("generate")}
                  style={[
                    homeStyles.generateRecipeButton,
                    {
                      backgroundColor: '#52B788',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 6,
                    }
                  ]}
                >
                  <Text style={[
                    homeStyles.generateRecipeButtonText,
                    { color: '#fff', fontWeight: 'bold' }
                  ]}>
                    Generate Recipes
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Saved Recipes */}
        <View style={{ maxHeight: windowHeight * 0.19 }}>
          <Text style={homeStyles.header}>
            Saved Recipes:
          </Text>
          <FlatList
            data={savedRecipes}
            keyExtractor={(item) => item.itemId}
            renderItem={renderSavedRecipe}
            ListEmptyComponent={() => (
              <View style={homeStyles.emptyText}>
                <Text>No saved recipes yet. Star recipes to save them!</Text>
              </View>
            )}
            ListHeaderComponent={
              isLoadingSaved ? (
                <View style={homeStyles.emptyText}>
                  <ActivityIndicator size="large" color="#52B788" />
                </View>
              ) : null
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;