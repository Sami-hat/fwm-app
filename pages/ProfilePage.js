import { recipeService, inventoryService, preferencesService } from '../services/apiService';

import { React, useState, useEffect } from "react";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
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
    <View style={styles.container}>
      <Header />

      {/* If userId >= 1, user is signed in/up */}
      {userId < 1 ? (
        // Displayed if user not signed in
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={styles.banner}>
            <Text h4 style={styles.welcomeText}>
              Welcome! Please sign up or log in to access your profile.
            </Text>
          </View>

          <Button
            title="Sign Up"
            onPress={() => navigation.navigate("SignUp")}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />

          <Button
            title="Log In"
            onPress={() => navigation.navigate("Login")}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />

          <View style={styles.statisticsBox}>
            <Text h3 style={styles.statisticsTitle}>
              Your Statistics
            </Text>
            <Text style={styles.statisticsText}>
              Make an account or log in to see statistics. Once you make an
              account, you will be able to see your past meals here.
            </Text>
          </View>
        </View>
      ) : (
        // Displayed if user signed in
        <View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {/* Set Preferences */}
            <Button
              title="Set Preferences     "
              icon={<AntDesign name="edit" size={18} color="white" />}
              iconRight
              onPress={handlePreferencesPress}
              buttonStyle={{
                ...styles.loggedInButton,
                backgroundColor: "#44c339dc",
              }}
              titleStyle={styles.buttonText}
            />

            {/* Scan Barcode */}
            <Button
              title="Scan Barcode     "
              iconRight
              icon={<Feather name="grid" size={18} color="white" />}
              onPress={() => navigation.navigate("Scanner")}
              buttonStyle={{
                ...styles.loggedInButton,
                backgroundColor: "#B8528A",
              }}
              titleStyle={styles.buttonText}
            />
            {/* Take Image */}
            <Button
              title="Take Image     "
              icon={<Feather name="camera" size={18} color="white" />}
              iconRight
              onPress={() => navigation.navigate("Camera")}
              buttonStyle={{
                ...styles.loggedInButton,
                backgroundColor: "#D8A052",
              }}
              titleStyle={styles.buttonText}
            />
            {/* Log Out */}
            <Button
              title="Log Out     "
              icon={<Feather name="log-out" size={18} color="white" />}
              iconRight
              onPress={() => handleLogout()}
              buttonStyle={{
                ...styles.loggedInButton,
                backgroundColor: "#5295B7FF",
              }}
              titleStyle={styles.buttonText}
            />
          </View>

          {/* Preferences Display */}
          {preferences && Object.keys(preferences).length > 0 && (
            <View style={styles.preferencesDisplay}>
              <Text style={styles.preferencesTitle}>Active Dietary Preferences:</Text>
              <Text style={styles.preferencesText}>
                {Object.entries(preferences)
                  .filter(([key, value]) => value === true)
                  .map(([key]) => key.replace('is_', '').replace('_', ' '))
                  .map(pref => pref.charAt(0).toUpperCase() + pref.slice(1))
                  .join(', ') || 'None'}
              </Text>
            </View>
          )}

          {/* Recipes */}
          <View style={{ maxHeight: windowHeight * 0.5 }}>
            <Text h4 style={styles.header}>
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: "#52B788",
    height: Dimensions.get("window").height * 0.08,
    margin: "3%",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  loggedInButton: {
    width: Dimensions.get("window").width * 0.85,
    height: Dimensions.get("window").height * 0.07,
    marginVertical: "2%",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  statisticsBox: {
    width: "85%",
    backgroundColor: "#52B788",
    padding: "5%",
    marginTop: "5%",
    borderRadius: 10,
    alignItems: "center",
  },
  statisticsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: "5%",
    color: "#FFFFFF",
  },
  statisticsText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  banner: {
    width: "110%",
    backgroundColor: "#5295B7FF",
    padding: "7%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5%",
  },
  welcomeText: {
    fontSize: 22,
    textAlign: "center",
    color: "#FFFFFF",
  },
  header: {
    fontSize: 30,
    textAlign: "left",
    lineHeight: 70,
    color: "black",
  },
  preferencesDisplay: {
    backgroundColor: "#f0f8ff",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#52B788",
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  preferencesText: {
    fontSize: 14,
    color: "#666",
  },
});