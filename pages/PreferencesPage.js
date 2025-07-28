import { preferencesService } from '../services/apiService';

import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, CheckBox } from "@rneui/themed";

export const PreferencesPage = ({ userId }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    is_vegan: false,
    is_vegetarian: false,
    is_gluten_free: false,
    is_dairy_free: false,
    is_nut_free: false,
    is_high_protein: false,
    is_low_carb: false,
  });

  // Load current preferences
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await preferencesService.get(userId);
      setPreferences(data);
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const savePreferences = async () => {
    try {
      await preferencesService.update(userId, preferences);
      Alert.alert("Success", "Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      Alert.alert("Error", "Failed to save preferences");
    }
  };

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h3 style={styles.title}>
        Dietary Preferences
      </Text>

      <CheckBox
        title="Vegan"
        checked={preferences.is_vegan}
        onPress={() => updatePreference('is_vegan', !preferences.is_vegan)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

      <CheckBox
        title="Vegetarian"
        checked={preferences.is_vegetarian}
        onPress={() => updatePreference('is_vegetarian', !preferences.is_vegetarian)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

      <CheckBox
        title="Gluten Free"
        checked={preferences.is_gluten_free}
        onPress={() => updatePreference('is_gluten_free', !preferences.is_gluten_free)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

      <CheckBox
        title="Dairy Free"
        checked={preferences.is_dairy_free}
        onPress={() => updatePreference('is_dairy_free', !preferences.is_dairy_free)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

      <CheckBox
        title="Nut Free"
        checked={preferences.is_nut_free}
        onPress={() => updatePreference('is_nut_free', !preferences.is_nut_free)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

     <CheckBox
        title="High Protein"
        checked={preferences.is_high_protein}
        onPress={() => updatePreference('is_high_protein', !preferences.is_high_protein)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

      <CheckBox
        title="Low Carb"
        checked={preferences.is_low_carb}
        onPress={() => updatePreference('is_low_carb', !preferences.is_low_carb)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />

      <Button
        title="Save Preferences"
        onPress={savePreferences}
        loading={loading}
        buttonStyle={styles.saveButton}
        titleStyle={styles.buttonTitle}
      />

      <Button
        title="Cancel"
        type="clear"
        titleStyle={styles.cancelText}
        onPress={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  checkboxContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: "normal",
  },
  saveButton: {
    backgroundColor: "#52B788",
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 10,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelText: {
    color: "#5295B7",
    fontSize: 16,
  },
});

export default PreferencesPage;