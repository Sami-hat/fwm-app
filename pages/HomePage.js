import { profileStyles } from "../styles/ProfilePageStyles";
import {
    recipeService,
    inventoryService,
    preferencesService,
} from "../services/apiService";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { View, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button, Text, ListItem, Icon } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Alert } from "react-native";

// Home Page, User is signed in
const HomePage = ({ userId, setRecipe }) => {
    const windowHeight = Dimensions.get("window").height;
    const navigation = useNavigation();
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [preferences, setPreferences] = useState(null);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
    const [isLoadingSaved, setIsLoadingSaved] = useState(false);
    const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

    const shouldGenerateRecipes = useRef(false);
    const isGenerating = useRef(false);

    React.useEffect(() => {
        if (userId == 0) {
            navigation.goBack();
        }
    }, [userId]);

    // Create recipes based on inventory and preferences
    const generateRecipes = async () => {
        if (isGenerating.current || !ingredients || ingredients.length === 0) {
            return;
        }

        isGenerating.current = true;
        setIsLoadingRecipes(true);

        try {
            console.log("Generating recipes for ingredients:", ingredients);
            const recipesList = await recipeService.generate(ingredients, userId);
            setRecipes(recipesList);
        } catch (error) {
            console.error("Recipe generation error:", error);

            if (
                error.message.includes("overloaded") ||
                error.message.includes("503")
            ) {
                Alert.alert(
                    "Service Busy",
                    "The recipe service is temporarily busy. Please try again in a minute.",
                    [
                        { text: "OK" },
                        {
                            text: "Retry",
                            onPress: () => {
                                setTimeout(() => generateRecipes(), 5000);
                            },
                        },
                    ]
                );
            } else {
                Alert.alert(
                    "Error",
                    "Failed to generate recipes. Please try again later."
                );
            }
        } finally {
            setIsLoadingRecipes(false);
            isGenerating.current = false;
        }
    };

    // Load user preferences
    const loadPreferences = async () => {
        if (userId >= 1) {
            try {
                const userPrefs = await preferencesService.get(userId);
                setPreferences(userPrefs);
                return true;
            } catch (error) {
                console.log("Error loading preferences:", error);
                setPreferences({});
                return false;
            }
        }
        return false;
    };

    // Get users inventory
    const loadInventory = async () => {
        if (userId >= 1) {
            try {
                const data = await inventoryService.getNames(userId);
                const ingredientsString = data.join(", ");
                setIngredients(ingredientsString);
                return ingredientsString.length > 0;
            } catch (error) {
                console.error("Error fetching inventory names:", error);
                setIngredients([]);
                return false;
            }
        }
        return false;
    };

    // Load saved recipes
    const loadSavedRecipes = async () => {
        if (userId >= 1) {
            try {
                setIsLoadingSaved(true);
                const saved = await recipeService.getSaved(userId);
                // Parse JSON strings back to arrays/objects
                const parsedRecipes = saved.map(recipe => ({
                    ...recipe,
                    ingredients_needed: typeof recipe.ingredients_needed === 'string'
                        ? JSON.parse(recipe.ingredients_needed)
                        : recipe.ingredients_needed,
                    instructions: typeof recipe.instructions === 'string'
                        ? JSON.parse(recipe.instructions)
                        : recipe.instructions
                }));
                setSavedRecipes(parsedRecipes);
            } catch (error) {
                console.error("Error loading saved recipes:", error);
                setSavedRecipes([]);
            } finally {
                setIsLoadingSaved(false);
            }
        }
    };

    // Initial data load
    useEffect(() => {
        if (userId >= 1 && !hasLoadedInitialData) {
            const loadInitialData = async () => {
                // Load inventory, preferences, and saved recipes
                const [hasInventory, hasPreferences] = await Promise.all([
                    loadInventory(),
                    loadPreferences(),
                    loadSavedRecipes()
                ]);

                setHasLoadedInitialData(true);

                // Only generate recipes if we have inventory
                if (hasInventory) {
                    shouldGenerateRecipes.current = true;
                    await generateRecipes();
                }
            };

            loadInitialData();
        }
    }, [userId]);

    // Listen for navigation focus to reload data
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            // Skip the initial load
            if (!hasLoadedInitialData) return;

            // Reload data when returning to the screen
            if (userId >= 1) {
                const reloadData = async () => {
                    const [hasInventory] = await Promise.all([
                        loadInventory(),
                        loadPreferences(),
                        loadSavedRecipes() // Reload saved recipes too
                    ]);

                    // Regenerate recipes if inventory changed
                    if (hasInventory && shouldGenerateRecipes.current) {
                        await generateRecipes();
                    }
                };

                reloadData();
            }
        });

        return unsubscribe;
    }, [navigation, userId, hasLoadedInitialData]);

    const handlePreferencesPress = () => {
        navigation.navigate("Preferences");
    };

    return (
        <View style={profileStyles.container}>
            {/* <Header /> */}
            <View>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    {/* Scan Barcode */}
                    <Button
                        title="Scan Barcode     "
                        iconRight
                        icon={<Feather name="grid" size={18} color="white" />}
                        onPress={() => navigation.navigate("Scanner")}
                        buttonStyle={{
                            ...profileStyles.button,
                            backgroundColor: "#B8528A",
                        }}
                        titleStyle={profileStyles.buttonText}
                    />
                    {/* Take Image */}
                    <Button
                        title="Take Image        "
                        icon={<Feather name="camera" size={18} color="white" />}
                        iconRight
                        onPress={() => navigation.navigate("Camera")}
                        buttonStyle={{
                            ...profileStyles.button,
                            backgroundColor: "#D8A052",
                        }}
                        titleStyle={profileStyles.buttonText}
                    />
                </View>

                {/* Preferences Display */}
                {preferences && Object.keys(preferences).length > 0 && (
                    <View style={profileStyles.preferencesDisplay}>
                        <Text style={profileStyles.preferencesTitle}>
                            Active Dietary Preferences:
                        </Text>
                        <Text style={profileStyles.preferencesText}>
                            {Object.entries(preferences)
                                .filter(([key, value]) => value === true && key.startsWith('is_'))
                                .map(([key]) =>
                                    key
                                        .replace(/^is_|_/g, " ")
                                        .trim()
                                        .split(" ")
                                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")
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
                <View style={{ maxHeight: windowHeight * 0.3 }}>
                    <Text h4 style={profileStyles.header}>
                        Suggested Recipes:
                    </Text>
                    {ingredients.length > 0 ? (
                        isLoadingRecipes ? (
                            <View>
                                <ActivityIndicator size="large" color="#52B788" />
                                <Text style={{ marginTop: 10 }}>Finding recipes...</Text>
                            </View>
                        ) : recipes.length > 0 ? (
                            <FlatList
                                data={recipes}
                                keyExtractor={(item, index) => `${item.recipe_name}-${index}`}
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
                        ) : (
                            <View style={{ paddingBottom: 10 }}>
                                <Text>No recipes found. Try adding more ingredients!</Text>
                                <Button
                                    title="Retry"
                                    onPress={generateRecipes}
                                    buttonStyle={{ marginTop: 10, paddingBottom: 10 }}
                                    type="outline"
                                />
                            </View>
                        )
                    ) : (
                        <Text>No ingredients in inventory.</Text>
                    )}
                </View>

                {/* Saved Recipes */}
                <View style={{ maxHeight: windowHeight * 0.3 }}>
                    <Text h4 style={profileStyles.header}>
                        Saved Recipes:
                    </Text>
                    {isLoadingSaved ? (
                        <View>
                            <ActivityIndicator size="large" color="#52B788" />
                        </View>
                    ) : savedRecipes.length > 0 ? (
                        <FlatList
                            data={savedRecipes}
                            keyExtractor={(item, index) => `saved-${item.id || index}`}
                            renderItem={({ item }) => (
                                <ListItem
                                    bottomDivider
                                    onPress={() => {
                                        setRecipe(item);
                                        navigation.navigate("Recipe");
                                    }}
                                >
                                    <Icon
                                        name="star"
                                        type="material"
                                        color="#FFD700"
                                        size={20}
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title>{item.recipe_name}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            )}
                        />
                    ) : (
                        <Text>No saved recipes yet. Star recipes to save them!</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default HomePage;