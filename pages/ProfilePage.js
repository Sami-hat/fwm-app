import { recipeService, inventoryService, preferencesService } from '../services/apiService';
import { profileStyles } from '../styles/ProfilePageStyles';

import { React, useState, useEffect } from "react";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { View, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { Button, Text, ListItem } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Alert } from 'react-native';


export const ProfilePage = ({ userId, setUserId, setRecipe }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [preferencesVersion, setPreferencesVersion] = useState(0);

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
      console.error('Recipe generation error:', error);

      if (error.message.includes("overloaded") || error.message.includes("503")) {
        Alert.alert(
          "Service Busy",
          "The recipe service is temporarily busy. Please try again in a minute.",
          [
            { text: "OK" },
            {
              text: "Retry",
              onPress: () => {
                setTimeout(() => generateRecipes(), 5000);
              }
            }
          ]
        );
      } else {
        Alert.alert("Error", "Failed to generate recipes. Please try again later.");
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

  // Get user's inventory
  useEffect(() => {
    if (userId >= 1) {
      inventoryService.getNames(userId)
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

  // Generate recipes when ingredients OR preferences change
  useEffect(() => {
    if (ingredients.length > 0 && userId >= 1) {
      setRecipes([]); // Clear old recipes
      generateRecipes();
    } else {
      setRecipes([]);
    }
  }, [ingredients, preferences, preferencesVersion]); // Added preferences dependencies

  // Listen for navigation focus to reload preferences
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Reload preferences when returning from preferences screen
      if (userId >= 1) {
        loadPreferences().then(() => {
          // Increment version to trigger recipe regeneration
          setPreferencesVersion(prev => prev + 1);
        });
      }
    });

    return unsubscribe;
  }, [navigation, userId]);

  const handleLogout = async () => {
    setUserId(0);
    setIngredients([]);
    setRecipes([]);
    setPreferences(null);
    setPreferencesVersion(0);
  };

  const handlePreferencesPress = () => {
    navigation.navigate('Preferences');
  };

  return (
    <View style={profileStyles.container}>
      <Header />

      {/* If userId >= 1, user is signed in/up */}
      {userId < 1 ? (
        // Displayed if user not signed in
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={profileStyles.banner}>
            <Text h4 style={profileStyles.welcomeText}>
              Welcome! Please sign up or log in to access your profile.
            </Text>
          </View>

          <Button
            title="Sign Up"
            onPress={() => navigation.navigate("SignUp")}
            buttonStyle={profileStyles.button}
            titleStyle={profileStyles.buttonText}
          />

          <Button
            title="Log In"
            onPress={() => navigation.navigate("Login")}
            buttonStyle={profileStyles.button}
            titleStyle={profileStyles.buttonText}
          />

          <View style={profileStyles.statisticsBox}>
            <Text h3 style={profileStyles.statisticsTitle}>
              Your Statistics
            </Text>
            <Text style={profileStyles.statisticsText}>
              Make an account or log in to see statistics. Once you make an
              account, you will be able to see your past meals here.
            </Text>
          </View>
        </View>
      ) : (
        // Displayed if user signed in
        <View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>

            {/* Scan Barcode */}
            <Button
              title="Scan Barcode     "
              iconRight
              icon={<Feather name="grid" size={18} color="white" />}
              onPress={() => navigation.navigate("Scanner")}
              buttonStyle={{
                ...profileStyles.loggedInButton,
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
                ...profileStyles.loggedInButton,
                backgroundColor: "#D8A052",
              }}
              titleStyle={profileStyles.buttonText}
            />
            {/* Log Out */}
            <Button
              title="Log Out     "
              icon={<Feather name="log-out" size={18} color="white" />}
              iconRight
              onPress={() => handleLogout()}
              buttonStyle={{
                ...profileStyles.loggedInButton,
                backgroundColor: "#5295B7FF",
              }}
              titleStyle={profileStyles.buttonText}
            />
          </View>

          {/* Preferences Display */}
          {preferences && Object.keys(preferences).length > 0 && (
            <View style={profileStyles.preferencesDisplay}>
              <Text style={profileStyles.preferencesTitle}>Active Dietary Preferences:</Text>
              <Text style={profileStyles.preferencesText}>
                {Object.entries(preferences)
                  .filter(([key, value]) => value === true)
                  .map(([key]) => key.replace('is_', '').replace('_', ' '))
                  .map(pref => pref.charAt(0).toUpperCase() + pref.slice(1))
                  .join(', ') || 'None'}
              </Text>
              <TouchableOpacity
                style={{ position: 'absolute', top: 10, right: 10 }}
                onPress={handlePreferencesPress}
              >
                <AntDesign name="edit" size={24} color="#52B788" />
              </TouchableOpacity>
            </View>
          )}

          {/* Recipes */}
          <View style={{ maxHeight: windowHeight * 0.5 }}>
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

          {/* <Button
            title="Generate More Recipes    "
            icon={<AntDesign name="pluscircleo" size={18} color="white" />}
            iconRight
            onPress={async () => {
              if (ingredients.length > 0 && userId >= 1) {
                try {
                  const newRecipes = await recipeService.generate(ingredients, userId);
                  setRecipes(prevRecipes => [...prevRecipes, ...newRecipes.slice(0, 3)]);
                } catch (error) {
                  console.error('Recipe generation error:', error);
                  Alert.alert("Error", "Failed to generate additional recipes.");
                }
              }
            }}
            buttonStyle={{
              ...profileStyles.loggedInButton,
              backgroundColor: "#52B788",
              marginTop: 10
            }}
            titleStyle={profileStyles.buttonText}
          /> */}

        </View>
      )}
    </View>
  );
};

export default ProfilePage;