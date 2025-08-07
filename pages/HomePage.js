import { profileStyles } from "../styles/ProfilePageStyles";
import {
    recipeService,
    inventoryService,
    preferencesService,
} from "../services/apiService";

import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { View, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { Button, Text, ListItem } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Alert } from "react-native";

// Home Page, User is signed in
const HomePage = ({ userId, setRecipe }) => {
    const windowHeight = Dimensions.get("window").height;
    const navigation = useNavigation();
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [preferences, setPreferences] = useState(null);
    const [preferencesVersion, setPreferencesVersion] = useState(0);

    React.useEffect(() => {
        if (userId == 0) {
            navigation.goBack();
        }
    }, [userId]);

    // Create recipes based on inventory and preferences
    const generateRecipes = async () => {
        if (!ingredients || ingredients.length === 0) {
            setRecipes([]);
            return;
        }

        try {
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
        }
    };

    // Load user preferences
    const loadPreferences = async () => {
        if (userId >= 1) {
            try {
                const userPrefs = await preferencesService.get(userId);
                setPreferences(userPrefs);
            } catch (error) {
                console.error("Error loading preferences:", error);
                setPreferences({});
            }
        }
    };

    // Get users inventory
    useEffect(() => {
        if (userId >= 1) {
            inventoryService
                .getNames(userId)
                .then((data) => {
                    const ingredientsString = data.join(", ");
                    setIngredients(ingredientsString);
                })
                .catch((error) => {
                    console.error("Error fetching inventory names:", error);
                    setIngredients([]);
                });
        } else {
            setIngredients([]);
        }
    }, [userId]);

    // Load preferences when user changes
    useEffect(() => {
        if (userId >= 1) {
            loadPreferences();
        } else {
            setPreferences(null);
        }
    }, [userId]);

    // Generate recipes when ingredients or preferences change
    useEffect(() => {
        if (ingredients.length > 0 && userId >= 1) {
            setRecipes([]);
            generateRecipes();
        } else {
            setRecipes([]);
        }
    }, [ingredients, preferences, preferencesVersion]);

    // Listen for navigation focus to reload preferences
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            // Reload preferences when returning from preferences screen
            if (userId >= 1) {
                loadPreferences().then(() => {
                    // Increment version to trigger recipe regeneration
                    setPreferencesVersion((prev) => prev + 1);
                });
            }
        });

        return unsubscribe;
    }, [navigation, userId]);

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
                        title="Take Image     "
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
                        recipes.length > 0 ? (
                            <FlatList
                                data={recipes}
                                keyExtractor={(item) => item.recipe_name}
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
                            <Text>Finding recipes...</Text>
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
                    {[] > 0 ? (
                        <FlatList
                            data={[]}
                            keyExtractor={(item) => item.recipe_name}
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
                        <Text>No Saved Recipes.</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default HomePage;
