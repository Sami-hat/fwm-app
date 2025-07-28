import { Header } from "../components/Header";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, Input } from "@rneui/themed";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

export const RecipePage = ({ ip, userId, recipe }) => {
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
    // const numServings = parseInt(servings);
    // if (isNaN(numServings) || numServings === 0) return "Not specified";
    // return `${numServings} ${numServings === 1 ? 'serving' : 'servings'}`;
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
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        <View style={styles.recipeContainer}>
          <Text h3 style={styles.title}>
            {recipe.recipe_name}
          </Text>

          <Text h4 style={styles.subtitle}>
            Ingredients
          </Text>
          <Text style={styles.displayText}>
            {formatIngredients(getString(recipe.ingredients_needed))}
          </Text>

          <Text h4 style={styles.subtitle}>
            Method
          </Text>
          <Text style={styles.displayText}>
            {formatMethod(getString(recipe.instructions))}
          </Text>

          {/* <Text h4 style={styles.subtitle}>
            Cooking Time
          </Text>
          <Text style={styles.displayText}>
            {formatTime(getString(recipe.cooking_time))}
          </Text>

          <Text h4 style={styles.subtitle}>
            Preparation Time 
          </Text>
          <Text style={styles.displayText}>
            {formatTime(getString(recipe.preparation_time))}
          </Text> */}

          <Text h4 style={styles.subtitle}>
            Servings
          </Text>
          <Text style={styles.displayText}>
            {formatServings(getString(recipe.servings))}
          </Text>

          <Text h4 style={styles.subtitle}>
            Difficulty
          </Text>
          <Text style={styles.displayText}>
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
        buttonStyle={[styles.button, { marginTop: 10 }]}
      />

      <Button
        title="Back to Home"
        onPress={() => navigation.navigate("ProfileMain")}
        buttonStyle={styles.button}
      />

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Input
              placeholder="Enter recipient email here..."
              value={recipient}
              onChangeText={setRecipient}
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
            />
            <Button
              title="Submit"
              onPress={handlePopupSubmit}
              buttonStyle={styles.submitButton}
              titleStyle={styles.modalButtonText}
            />
            <Button
              title="Cancel"
              onPress={handleCancel}
              buttonStyle={styles.submitButton}
              titleStyle={styles.modalButtonText}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  recipeContainer: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  displayText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#52B788",
    alignItems: "center",
    borderRadius: 25,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 12,
    alignSelf: "center",
    width: "50%",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  modalButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  openButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
});
