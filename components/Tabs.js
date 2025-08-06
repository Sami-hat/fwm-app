import React, { useState, useEffect } from "react";
import { LandingPage } from "../pages/LandingPage";
import { HomePage } from "../pages/HomePage";
import { EntriesPage } from "../pages/EntriesPage";
import { CameraPage } from "../pages/CameraPage";
import { ScannerPage } from "../pages/ScannerPage";
import { PreferencesPage } from "../pages/PreferencesPage";
import { SignUpPage } from "../pages/SignUpPage";
import { LoginPage } from "../pages/LoginPage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { TabView, TabBar } from "react-native-tab-view";
import { useWindowDimensions } from "react-native";
import { RecipePage } from "../pages/RecipePage";
import { SettingsPage } from "../pages/SettingsPage";

const Stack = createStackNavigator();

const ProfileStack = ({ userId, setUserId, setIndex, recipe, setRecipe }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Landing">
      {(props) => (
        <LandingPage
          {...props}
          userId={userId}
          setUserId={setUserId}
          setIndex={setIndex}
          setRecipe={setRecipe}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="SignUp">
      {(props) => (
        <SignUpPage {...props} userId={userId} setUserId={setUserId} />
      )}
    </Stack.Screen>
    <Stack.Screen name="Login">
      {(props) => (
        <LoginPage {...props} userId={userId} setUserId={setUserId} />
      )}
    </Stack.Screen>
    <Stack.Screen name="Home">
      {(props) => (
        <HomePage
          {...props}
          userId={userId}
          setUserId={setUserId}
          setRecipe={setRecipe}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="Camera">
      {(props) => <CameraPage {...props} userId={userId} />}
    </Stack.Screen>
    <Stack.Screen name="Scanner">
      {(props) => <ScannerPage {...props} userId={userId} />}
    </Stack.Screen>
    <Stack.Screen name="Preferences">
      {(props) => <PreferencesPage {...props} userId={userId} />}
    </Stack.Screen>
    <Stack.Screen name="Recipe">
      {(props) => <RecipePage {...props} userId={userId} recipe={recipe} />}
    </Stack.Screen>
    <Stack.Screen name="AddEntry">
      {(props) => <AddEntry {...props} userId={userId} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const routes = [
  { key: "profile", title: "Home" },
  { key: "entries", title: "Inventory" },
  { key: "settings", title: "Settings" },
];

export const Tabs = ({ ip }) => {
  const dimensions = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [userId, setUserId] = React.useState(null);
  const [recipe, setRecipe] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [itemUri, setItemUri] = React.useState(null);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "profile":
        return (
          <ProfileStack
            userId={userId}
            setUserId={setUserId}
            recipe={recipe}
            setRecipe={setRecipe}
            item={item}
            setItem={setItem}
            itemUri={itemUri}
            setItemUri={setItemUri}
            setIndex={setIndex}
          />
        );
      case "entries":
        return <EntriesPage userId={userId} />;
      case "settings":
        return (
          <SettingsPage
            userId={userId}
            setUserId={setUserId}
            setIndex={setIndex}
          />
        );
      default:
        return null;
    };
  };

  const renderTabBar = (props) => {
    if (!userId) return null;
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: "#52B788" }}
        style={{
          backgroundColor: "#52B788",
          fontSize: 50,
          height: dimensions.height * 0.06,
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
      />
    </NavigationContainer>
  );
};
