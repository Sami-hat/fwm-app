import { preferencesStyles } from "../styles/PreferencesPageStyles";
import { preferencesService } from "../services/apiService";

import React, { useState, useEffect } from "react";
import { SafeAreaView, Alert, ScrollView, View, TouchableOpacity, Text, Switch, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from '../contexts/AuthContext';

const PreferencesPage = ({ }) => {
  const { user } = useAuth();
  const userId = user?.id;

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
    custom_text: "",
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await preferencesService.get(userId);

      setPreferences({
        ...data,
        custom_text: data.custom_text || "",
      });
    } catch (error) {
      console.error("Error loading preferences:", error);

      setPreferences({
        is_vegan: false,
        is_vegetarian: false,
        is_gluten_free: false,
        is_dairy_free: false,
        is_nut_free: false,
        is_high_protein: false,
        is_low_carb: false,
        is_custom: false,
        custom_text: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setLoading(true);

      const prefsToSave = {
        ...preferences,
        custom_text: preferences.is_custom ? preferences.custom_text : "",
      };

      await preferencesService.update(userId, prefsToSave);
      Alert.alert("Success", "Preferences saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving preferences:", error);
      Alert.alert("Error", "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleCustom = () => {
    const newValue = !preferences.is_custom;
    setPreferences((prev) => ({
      ...prev,
      is_custom: newValue,
      custom_text: newValue ? prev.custom_text : "",
    }));
  };

  return (
    <SafeAreaView style={preferencesStyles.container}>
      <ScrollView
        contentContainerStyle={preferencesStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={preferencesStyles.title}>
          Dietary Preferences
        </Text>

        <Switch
          title="Vegan"
          checked={preferences.is_vegan}
          onPress={() => updatePreference("is_vegan", !preferences.is_vegan)}
          containerStyle={preferencesStyles.checkboxContainer}
          textStyle={preferencesStyles.checkboxText}
          checkedColor="#52B788"
        />

        <Switch
          title="Vegetarian"
          checked={preferences.is_vegetarian}
          onPress={() =>
            updatePreference("is_vegetarian", !preferences.is_vegetarian)
          }
          containerStyle={preferencesStyles.checkboxContainer}
          textStyle={preferencesStyles.checkboxText}
          checkedColor="#52B788"
        />

        <Switch
          title="Gluten Free"
          checked={preferences.is_gluten_free}
          onPress={() =>
            updatePreference("is_gluten_free", !preferences.is_gluten_free)
          }
          containerStyle={preferencesStyles.checkboxContainer}
          textStyle={preferencesStyles.checkboxText}
          checkedColor="#52B788"
        />

        <Switch
          title="Dairy Free"
          checked={preferences.is_dairy_free}
          onPress={() =>
            updatePreference("is_dairy_free", !preferences.is_dairy_free)
          }
          containerStyle={preferencesStyles.checkboxContainer}
          textStyle={preferencesStyles.checkboxText}
          checkedColor="#52B788"
        />

        <Switch
          title="Nut Free"
          checked={preferences.is_nut_free}
          onPress={() =>
            updatePreference("is_nut_free", !preferences.is_nut_free)
          }
          containerStyle={preferencesStyles.checkboxContainer}
          textStyle={preferencesStyles.checkboxText}
          checkedColor="#52B788"
        />

        <Switch
          title="High Protein"
          checked={preferences.is_high_protein}
          onPress={() =>
            updatePreference("is_high_protein", !preferences.is_high_protein)
          }
          containerStyle={preferencesStyles.checkboxContainer}
          textStyle={preferencesStyles.checkboxText}
          checkedColor="#52B788"
        />

        <Switch
          title="Low Carb"
          checked={preferences.is_low_carb}
          onPress={() =>
            updatePreference("is_low_carb", !preferences.is_low_carb)
          }
          containerStyle={preferencesStyles.checkboxContainer}
          textStyle={preferencesStyles.checkboxText}
          checkedColor="#52B788"
        />

        <Switch
          title="Custom Dietary Restrictions"
          checked={preferences.is_custom}
          onPress={toggleCustom}
          containerStyle={preferencesStyles.checkboxContainer}
          textStyle={preferencesStyles.checkboxText}
          checkedColor="#52B788"
        />

        {preferences.is_custom && (
          <View style={preferencesStyles.customInputContainer}>
            <TextInput
              placeholder="Enter your custom dietary preferences..."
              placeholderTextColor="#999"
              value={preferences.custom_text}
              onChangeText={(text) => updatePreference("custom_text", text)}
              multiline
              numberOfLines={3}
              inputContainerStyle={preferencesStyles.customInputInner}
              inputStyle={preferencesStyles.customInputText}
              containerStyle={preferencesStyles.customInputWrapper}
              label="Custom Preferences"
              labelStyle={preferencesStyles.customInputLabel}
              maxLength={500}
            />
            <Text style={preferencesStyles.characterCount}>
              {`${preferences.custom_text.length}/500`}
            </Text>
          </View>
        )}

        <TouchableOpacity
          title="Save Preferences"
          onPress={savePreferences}
          loading={loading}
          disabled={loading}
          buttonStyle={preferencesStyles.saveButton}
          titleStyle={preferencesStyles.buttonTitle}
        />

        <TouchableOpacity
          title="Cancel"
          type="clear"
          titleStyle={preferencesStyles.cancelText}
          onPress={() => navigation.goBack()}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PreferencesPage;
