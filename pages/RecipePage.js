import { recipeStyles } from '../styles/RecipePageStyles';

import React, { useState } from "react";
import { Header } from "../components/Header";
import {
  SafeAreaView,
  recipeStylesheet,
  Dimensions,
  ScrollView,
  Modal,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, Input } from "@rneui/themed";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

export const RecipePage = ({ userId, recipe }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [recipient, setRecipient] = useState("");

  // Recipe States
  const [ingredients, setIngredients] = useState("");

  // Convert a JSON to a String if input type was wrong
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
      return Object.values(ingredients).map((item) => `• ${item}`).join("\n");
    }
    return "";
  };

  // Parse the recipe method steps 
  const formatMethod = (method) => {
    const processSteps = (items) => items
      .filter(item => item.trim() && item.length > 2)
      .map((item, index) => {
        // Remove leading commas and spaces
        const cleanStep = item.trim().replace(/^[,\s]+/, '');
        return `${index + 1}. ${cleanStep}`;
      })
      .join("\n");

    if (typeof method === "string") return processSteps(method.split("."));
    if (Array.isArray(method)) return processSteps(method);
    if (typeof method === "object" && method !== null) return processSteps(Object.values(method));
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
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
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
    const filledStar = '★';
    const emptyStar = '☆';

    const stars = filledStar.repeat(numericDifficulty) +
      emptyStar.repeat(maxStars - numericDifficulty);

    return stars;
  };

  const handlePopupSubmit = async () => {
    await shareRecipe();
    setRecipient("");
    setModalVisible(false); // Close the popup
  };

  // Called when the Cancel button is pressed.
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
      <Header />

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

      <Button
        title="Share Recipe"
        onPress={async () => {
          await shareText(
            `${recipe.recipe_name}`,
            `Ingredients\n\n${formatIngredients(getString(
              recipe.ingredients_needed
            ))}\n\nMethod\n\n${formatMethod(getString(recipe.instructions))}\n\n`
          );
        }}
        buttonStyle={[recipeStyles.button, { marginTop: 10 }]}
      />

      <Button
        title="Back to Home"
        onPress={() => navigation.navigate("ProfileMain")}
        buttonStyle={recipeStyles.button}
      />

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