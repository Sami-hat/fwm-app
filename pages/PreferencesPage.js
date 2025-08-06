import { preferencesStyles } from "../styles/PreferencesPageStyles";
import { preferencesService } from "../services/apiService";

import React, { useState, useEffect } from "react";
import { SafeAreaView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Text, CheckBox, TextInput } from "@rneui/themed";

const PreferencesPage = ({ userId }) => {
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
    is_custom: false,
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
      navigation.goBack();
    } catch (error) {
      console.error("Error saving preferences:", error);
      Alert.alert("Error", "Failed to save preferences");
    }
  };

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SafeAreaView style={preferencesStyles.container}>
      <Text h3 style={preferencesStyles.title}>
        Dietary Preferences
      </Text>

      <CheckBox
        title="Vegan"
        checked={preferences.is_vegan}
        onPress={() => updatePreference("is_vegan", !preferences.is_vegan)}
        containerStyle={preferencesStyles.checkboxContainer}
        textStyle={preferencesStyles.checkboxText}
      />

      <CheckBox
        title="Vegetarian"
        checked={preferences.is_vegetarian}
        onPress={() =>
          updatePreference("is_vegetarian", !preferences.is_vegetarian)
        }
        containerStyle={preferencesStyles.checkboxContainer}
        textStyle={preferencesStyles.checkboxText}
      />

      <CheckBox
        title="Gluten Free"
        checked={preferences.is_gluten_free}
        onPress={() =>
          updatePreference("is_gluten_free", !preferences.is_gluten_free)
        }
        containerStyle={preferencesStyles.checkboxContainer}
        textStyle={preferencesStyles.checkboxText}
      />

      <CheckBox
        title="Dairy Free"
        checked={preferences.is_dairy_free}
        onPress={() =>
          updatePreference("is_dairy_free", !preferences.is_dairy_free)
        }
        containerStyle={preferencesStyles.checkboxContainer}
        textStyle={preferencesStyles.checkboxText}
      />

      <CheckBox
        title="Nut Free"
        checked={preferences.is_nut_free}
        onPress={() =>
          updatePreference("is_nut_free", !preferences.is_nut_free)
        }
        containerStyle={preferencesStyles.checkboxContainer}
        textStyle={preferencesStyles.checkboxText}
      />

      <CheckBox
        title="High Protein"
        checked={preferences.is_high_protein}
        onPress={() =>
          updatePreference("is_high_protein", !preferences.is_high_protein)
        }
        containerStyle={preferencesStyles.checkboxContainer}
        textStyle={preferencesStyles.checkboxText}
      />

      <CheckBox
        title="Low Carb"
        checked={preferences.is_low_carb}
        onPress={() =>
          updatePreference("is_low_carb", !preferences.is_low_carb)
        }
        containerStyle={preferencesStyles.checkboxContainer}
        textStyle={preferencesStyles.checkboxText}
      />

      <CheckBox
        title="Custom"
        checked={preferences.is_custom}
        onPress={() => updatePreference("is_custom", !preferences.is_custom)}
        containerStyle={preferencesStyles.checkboxContainer}
        textStyle={preferencesStyles.checkboxText}
      />
      {/* 
      {preferences.is_custom && (
        <TextInput
          style={preferencesStyles.customInput}
          placeholder="Enter custom dietary preferences"
          value={preferences.custom_text || ''}
          onChangeText={(text) => updatePreference('custom_text', text)}
          multiline
        />
      )} */}

      <Button
        title="Save Preferences"
        onPress={savePreferences}
        loading={loading}
        buttonStyle={preferencesStyles.saveButton}
        titleStyle={preferencesStyles.buttonTitle}
      />

      <Button
        title="Cancel"
        type="clear"
        titleStyle={preferencesStyles.cancelText}
        onPress={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
};

export default PreferencesPage;
