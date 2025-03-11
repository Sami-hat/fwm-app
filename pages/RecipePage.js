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

  const handlePopupSubmit = async () => {
    await shareRecipe();
    setRecipient(""); // Clear the input field
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
            {getString(recipe.ingredients_needed)}
          </Text>

          <Text h4 style={styles.subtitle}>
            Method
          </Text>
          <Text style={styles.displayText}>
            {getString(recipe.instructions)}
          </Text>
        </View>
      </ScrollView>

      <Button
        title="Share Recipe"
        onPress={async () => {
          await shareText(
            `${recipe.recipe_name}`,
            `Ingredients\n\n${getString(
              recipe.ingredients_needed
            )}\n\nMethod\n\n${getString(recipe.instructions)}\n\n`
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
