import { homeStyles } from "../styles/HomePageStyles";
import {
  recipeService,
  inventoryService,
  preferencesService,
} from "../services/apiService";

import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button, Text, ListItem, Icon } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

// Home Page, User is signed in
const HomePage = ({ userId, setRecipe }) => {
  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();

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
    if (userId === 0) {
      navigation.navigate("Landing");
    }
  }, [userId]);

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
  }, [navigation, userId, lastUserId]);

  const loadInitialData = async () => {
    if (userId >= 1) {
      loadInventory();
      loadPreferences();
      loadSavedRecipes();

      setSuggestedRecipes([]);
      setHasGeneratedRecipes(false);
    }
  };

  const loadInventory = async () => {
    if (userId < 1) return;

    try {
      const data = await inventoryService.getNames(userId);
      const ingredientsString = data.join(", ");
      setIngredients(ingredientsString);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setIngredients("");
    }
  };

  const loadPreferences = async () => {
    if (userId < 1) return;

    try {
      const userPrefs = await preferencesService.get(userId);
      setPreferences(userPrefs || {});
    } catch (error) {
      console.log("Error loading preferences:", error);
      setPreferences({});
    }
  };

  const loadSavedRecipes = async () => {
    if (userId < 1) return;

    setIsLoadingSaved(true);
    try {
      const saved = await recipeService.getSaved(userId);
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
    } catch (error) {
      console.error("Error loading saved recipes:", error);
      setSavedRecipes([]);
    }
    setIsLoadingSaved(false);
  };

  const generateRecipes = async (action) => {
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
  };

  const handleAddMore = () => {
    generateRecipes("add");
  };

  const handleRefreshRecipes = () => {
    generateRecipes("refresh");
  };

  const handlePreferencesPress = () => {
    navigation.navigate("Preferences");
  };

  return (
    <View style={homeStyles.container}>
      {/* <Header /> */}
      <View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {/* Scan Barcode */}
          <Button
            title="Scan Barcode"
            iconRight
            icon={
              <Feather
                name="grid"
                size={24}
                color="white"
                position="absolute"
                right="20"
              />
            }
            onPress={() => navigation.navigate("Scanner")}
            buttonStyle={{
              ...homeStyles.button,
              backgroundColor: "#B8528A",
            }}
            titleStyle={homeStyles.buttonText}
          />
          {/* Take Image */}
          <Button
            title="Take Image"
            icon={
              <Feather
                name="camera"
                size={24}
                color="white"
                position="absolute"
                right="20"
              />
            }
            iconRight
            onPress={() => navigation.navigate("Camera")}
            buttonStyle={{
              ...homeStyles.button,
              backgroundColor: "#D8A052",
            }}
            titleStyle={homeStyles.buttonText}
          />
        </View>

        {/* Preferences Display */}
        {preferences && Object.keys(preferences).length > 0 && (
          <View style={homeStyles.preferencesDisplay}>
            <Text style={homeStyles.preferencesTitle}>
              Active Dietary Preferences:
            </Text>
            <Text style={homeStyles.preferencesText}>
              {Object.entries(preferences)
                .filter(
                  ([key, value]) => value === true && key.startsWith("is_"),
                )
                .map(([key]) =>
                  key
                    .replace(/^is_|_/g, " ")
                    .trim()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                )
                .join(", ") || "None"}
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
          <Text h4 style={homeStyles.header}>
            Suggested Recipes:
          </Text>

          {isLoadingRecipes ? (
            <View style={{ alignItems: "center", padding: 20 }}>
              <ActivityIndicator size="large" color="#52B788" />
              <Text style={{ marginTop: 10 }}>Finding recipes...</Text>
            </View>
          ) : suggestedRecipes.length > 0 ? (
            <>
              <FlatList
                data={suggestedRecipes}
                keyExtractor={(item) => item.itemId}
                renderItem={({ item }) => (
                  <ListItem
                    bottomDivider
                    onPress={() => {
                      setRecipe(item);
                      navigation.navigate("Recipe");
                    }}
                  >
                    <ListItem.Content>
                      <ListItem.Title>{item.recipe_name}</ListItem.Title>
                    </ListItem.Content>
                  </ListItem>
                )}
              />
              <View style={{ flexDirection: 'row', margin: 10, gap: 10 }}>
                <Button
                  title="Add 3 More"
                  onPress={handleAddMore}
                  buttonStyle={homeStyles.recipeActionButton}
                  titleStyle={homeStyles.recipeActionButtonText}
                  icon={
                    <Feather
                      name="plus-circle"
                      size={18}
                      color="#52B788"
                      style={{ marginRight: 5 }}
                    />
                  }
                  type="outline"
                  disabled={isLoadingRecipes}
                />
                <Button
                  title="Refresh All"
                  onPress={handleRefreshRecipes}
                  buttonStyle={homeStyles.recipeActionButton}
                  titleStyle={homeStyles.recipeActionButtonText}
                  icon={
                    <Feather
                      name="refresh-cw"
                      size={18}
                      color="#4A90E2"
                      style={{ marginRight: 5 }}
                    />
                  }
                  type="outline"
                  disabled={isLoadingRecipes}
                />
              </View>
            </>
          ) : ingredients.length === 0 ? (
            <View style={{ padding: 20 }}>
              <Text>No ingredients in inventory. Add items to generate recipes!</Text>
            </View>
          ) : (
            <View style={{ padding: 20, alignItems: "center" }}>
              {hasGeneratedRecipes ? (
                <>
                  <Text style={{ marginBottom: 10 }}>
                    No recipes found. Try again?
                  </Text>
                  <Button
                    title="Retry"
                    onPress={generateRecipes("generate")}
                    buttonStyle={homeStyles.generateRecipeButton}
                    titleStyle={homeStyles.generateRecipeButtonText}
                    type="outline"
                  />
                </>
              ) : (
                <Button
                  title="Generate Recipes"
                  onPress={generateRecipes("generate")}
                  buttonStyle={homeStyles.generateRecipeButton}
                  titleStyle={homeStyles.generateRecipeButtonText}
                  type="solid"
                  color="#52B788"
                />
              )}
            </View>
          )}
        </View>

        {/* Saved Recipes */}
        <View style={{ maxHeight: windowHeight * 0.19 }}>
          <Text h4 style={homeStyles.header}>
            Saved Recipes:
          </Text>
          <FlatList
            data={savedRecipes}
            keyExtractor={(item) => item.itemId}
            renderItem={({ item }) => (
              <ListItem
                bottomDivider
                onPress={() => {
                  setRecipe(item);
                  navigation.navigate("Recipe");
                }}
              >
                <Icon name="star" type="material" color="#FFD700" size={20} />
                <ListItem.Content>
                  <ListItem.Title>{item.recipe_name}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            )}
            ListEmptyComponent={() => (
              <View style={{ padding: 20 }}>
                <Text>No saved recipes yet. Star recipes to save them!</Text>
              </View>
            )}
            ListHeaderComponent={
              isLoadingSaved ? (
                <View style={{ alignItems: "center", padding: 20 }}>
                  <ActivityIndicator size="large" color="#52B788" />
                </View>
              ) : null
            }
          />
        </View>
      </View>
    </View>
  );
};

export default HomePage;