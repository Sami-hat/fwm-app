import { recipeStyles } from "../styles/RecipePageStyles";
import { recipeService } from "../services/apiService";

import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { SafeAreaView, ScrollView, Modal, View, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, Input, Icon } from "@rneui/themed";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const RecipePage = ({ userId, recipe }) => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [saved, setSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Recipe States
    const [ingredients, setIngredients] = useState("");

    useEffect(() => {
        checkIfSaved();
    }, [recipe]);

    const checkIfSaved = async () => {
        try {
            const savedRecipes = await recipeService.getSaved(userId);
            const isSaved = savedRecipes.some(r => r.recipe_name === recipe.recipe_name);
            setSaved(isSaved);
        } catch (error) {
            console.error("Error checking saved status:", error);
        }
    };

    const handleSaveToggle = async () => {
        setIsLoading(true);
        try {
            if (saved) {
                // Find the saved recipe ID
                const savedRecipes = await recipeService.getSaved(userId);
                const savedRecipe = savedRecipes.find(r => r.recipe_name === recipe.recipe_name);

                if (savedRecipe) {
                    await recipeService.removeSaved(userId, savedRecipe.id);
                    setSaved(false);
                    Alert.alert("Success", "Recipe removed from favorites");
                }
            } else {
                // Save the recipe
                await recipeService.save(userId, {
                    recipe_name: recipe.recipe_name,
                    ingredients_needed: recipe.ingredients_needed,
                    instructions: recipe.instructions,
                    cooking_time: recipe.cooking_time || "Not specified",
                    prep_time: recipe.prep_time || "Not specified",
                    servings: recipe.servings || "Not specified",
                    difficulty: recipe.difficulty || "Not specified"
                });
                setSaved(true);
                Alert.alert("Success", "Recipe saved to favorites!");
            }
        } catch (error) {
            console.error("Error toggling save:", error);
            if (error.message.includes("already saved")) {
                setSaved(true);
                Alert.alert("Info", "This recipe is already in your favorites");
            } else {
                Alert.alert("Error", "Failed to update favorites");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Convert JSON to String
    const getString = (data) => {
        if (typeof data === "string") {
            return data;
        } else if (Array.isArray(data)) {
            return data.join(", ");
        } else if (typeof data === "object" && data !== null) {
            return Object.values(data).join(", ");
        }
        return "";
    };

    // Parse ingredient list and quantities
    const formatIngredients = (ingredients) => {
        if (typeof ingredients === "string") {
            return ingredients
                .split(",")
                .map((item) => `• ${item.trim()}`)
                .join("\n");
        } else if (Array.isArray(ingredients)) {
            return ingredients.map((item) => `• ${item}`).join("\n");
        } else if (typeof ingredients === "object" && ingredients !== null) {
            return Object.values(ingredients)
                .map((item) => `• ${item}`)
                .join("\n");
        }
        return "";
    };

    // Parse the recipe method steps
    const formatMethod = (method) => {
        const processSteps = (items) =>
            items
                .filter((item) => item.trim() && item.length > 2)
                .map((item, index) => {
                    const cleanStep = item.trim().replace(/^[,\s]+/, "");
                    return `${index + 1}. ${cleanStep}`;
                })
                .join("\n");

        if (typeof method === "string") return processSteps(method.split("."));
        if (Array.isArray(method)) return processSteps(method);
        if (typeof method === "object" && method !== null)
            return processSteps(Object.values(method));
        return "";
    };

    // Parse the cooking and preparation times
    const formatTime = (time) => {
        const cookingTime = parseInt(time);
        if (isNaN(cookingTime)) return "Not specified";
        if (cookingTime === 0) return "Not specified";
        if (cookingTime < 60) return `${cookingTime} minutes`;
        const hours = Math.floor(cookingTime / 60);
        const minutes = cookingTime % 60;
        if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
        return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""
            }`;
    };

    // Parse the servings
    const formatServings = (servings) => {
        if (!servings) return "Not specified";
        return servings.toString();
    };

    // Parse the difficulty
    const formatDifficulty = (difficulty) => {
        const numericDifficulty = parseInt(difficulty) || 0;
        const maxStars = 5;
        const filledStar = "★";
        const emptyStar = "☆";

        const stars =
            filledStar.repeat(numericDifficulty) +
            emptyStar.repeat(maxStars - numericDifficulty);

        return stars;
    };

    const handlePopupSubmit = async () => {
        await shareRecipe();
        setRecipient("");
        setModalVisible(false);
    };

    const handleCancel = () => {
        setRecipient("");
        setModalVisible(false);
    };

    const shareText = async (title, text) => {
        const fileUri = FileSystem.documentDirectory + `${title}` + ".txt";
        await FileSystem.writeAsStringAsync(fileUri, text);

        // Share with appropriate MIME type and UTI
        await Sharing.shareAsync(fileUri, {
            mimeType: "text/plain", // For Android
            UTI: "public.text", // For iOS
            dialogTitle: "Share Text",
        });
    };

    return (
        <SafeAreaView style={recipeStyles.container}>
            {/* <Header /> */}

            <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
                <View style={recipeStyles.recipeContainer}>
                    <Text h3 style={recipeStyles.title}>
                        {recipe.recipe_name}
                    </Text>

                    <Text h4 style={recipeStyles.subtitle}>
                        Ingredients
                    </Text>
                    <Text style={recipeStyles.displayText}>
                        {formatIngredients(getString(recipe.ingredients_needed))}
                    </Text>

                    <Text h4 style={recipeStyles.subtitle}>
                        Method
                    </Text>
                    <Text style={recipeStyles.displayText}>
                        {formatMethod(getString(recipe.instructions))}
                    </Text>

                    <Text h4 style={recipeStyles.subtitle}>
                        Servings
                    </Text>
                    <Text style={recipeStyles.displayText}>
                        {formatServings(getString(recipe.servings))}
                    </Text>

                    <Text h4 style={recipeStyles.subtitle}>
                        Difficulty
                    </Text>
                    <Text style={recipeStyles.displayText}>
                        {formatDifficulty(getString(recipe.difficulty))}
                    </Text>
                </View>
            </ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                }}
            >
                <Button
                    icon={<Icon name="arrow-back" type="material" color="black" />}
                    onPress={() => navigation.navigate("Home")}
                    buttonStyle={recipeStyles.iconButton}
                />

                <Button title="Consume Ingredients" buttonStyle={recipeStyles.button}
                    onPress={() => Alert.alert('TBC')}
                />

                <Button
                    icon={
                        isLoading ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            <Icon
                                name={saved ? "star" : "star-outline"}
                                type="material"
                                color={saved ? "#FFD700" : "black"}
                            />
                        )
                    }
                    onPress={handleSaveToggle}
                    buttonStyle={recipeStyles.iconButton}
                    disabled={isLoading}
                />

                <Button
                    icon={<Icon name="share" type="material" color="black" />}
                    onPress={async () => {
                        await shareText(
                            `${recipe.recipe_name}`,
                            `Ingredients\n\n${formatIngredients(
                                getString(recipe.ingredients_needed)
                            )}\n\nMethod\n\n${formatMethod(
                                getString(recipe.instructions)
                            )}\n\nServings\n\n${formatServings(
                                getString(recipe.servings)
                            )}`
                        );
                    }}
                    buttonStyle={recipeStyles.iconButton}
                />
            </View>

            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={recipeStyles.modalOverlay}>
                    <View style={recipeStyles.modalView}>
                        <Input
                            placeholder="Enter recipient email here..."
                            value={recipient}
                            onChangeText={setRecipient}
                            containerStyle={recipeStyles.inputContainer}
                            inputStyle={recipeStyles.input}
                        />
                        <Button
                            title="Submit"
                            onPress={handlePopupSubmit}
                            buttonStyle={recipeStyles.submitButton}
                            titleStyle={recipeStyles.modalButtonText}
                        />
                        <Button
                            title="Cancel"
                            onPress={handleCancel}
                            buttonStyle={recipeStyles.submitButton}
                            titleStyle={recipeStyles.modalButtonText}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default RecipePage;