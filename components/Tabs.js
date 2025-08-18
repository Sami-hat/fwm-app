import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TabView, TabBar } from "react-native-tab-view";
import { useWindowDimensions } from "react-native";
import { useAuth } from "../contexts/AuthContext";

import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
// import EntriesPage from "../pages/EntriesPage";
import CameraPage from "../pages/CameraPage";
import ScannerPage from "../pages/ScannerPage";
import PreferencesPage from "../pages/PreferencesPage";
import SignUpPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";
import RecipePage from "../pages/RecipePage";
// import SettingsPage from "../pages/SettingsPage";

const Stack = createStackNavigator();

const ProfileStack = ({ setIndex, recipe, setRecipe }) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing">
        {(props) => (
          <LandingPage
            {...props}
            setIndex={setIndex}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUpPage} />
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Home">
        {(props) => (
          <HomePage 
            {...props} 
            userId={userId} 
            setRecipe={setRecipe} 
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Camera">
        {(props) => <CameraPage {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Scanner">
        {(props) => <ScannerPage {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Preferences">
        {(props) => <PreferencesPage {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Recipe">
        {(props) => <RecipePage {...props} recipe={recipe} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const routes = [
  { key: "profile", title: "Home" },
  // { key: "entries", title: "Inventory" },
  // { key: "settings", title: "Settings" },
];

export const Tabs = () => {
  const dimensions = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [recipe, setRecipe] = useState(null);
  const [item, setItem] = useState(null);
  
  const { user, isAuthenticated, loading } = useAuth();
  const userId = user?.id;

  // Reset to home tab when user logs out
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      setIndex(0);
    }
  }, [isAuthenticated, loading]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "profile":
        return (
          <ProfileStack
            recipe={recipe}
            setRecipe={setRecipe}
            item={item}
            setItem={setItem}
            setIndex={setIndex}
          />
        );
      // case "entries":
      //   return <EntriesPage/>;
      // case "settings":
      //   return (
      //     <SettingsPage
      //       setIndex={setIndex}
      //     />
      //   );
      default:
        return null;
    }
  };

  const renderTabBar = (props) => {
    // Only show tab bar when user is authenticated
    if (!isAuthenticated) return null;
    
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: "#52B788" }}
        style={{
          backgroundColor: "#52B788",
          fontSize: 50,
          height: dimensions.height * 0.065,
        }}
      />
    );
  };

  return (
    <NavigationContainer>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: dimensions.width }}
        renderTabBar={renderTabBar}
        tabBarPosition="bottom"
        swipeEnabled={isAuthenticated}
      />
    </NavigationContainer>
  );
};