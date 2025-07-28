import React, { useState, useEffect } from "react";
import { ProfilePage } from "../pages/ProfilePage";
import { EntriesPage } from "../pages/EntriesPage";
import { CameraPage } from "../pages/CameraPage";
import { ScannerPage } from "../pages/ScannerPage";
import { PreferencesPage } from "../pages/PreferencesPage";
import { SignUpPage } from "../pages/SignUpPage";
import { LoginPage } from "../pages/LoginPage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useWindowDimensions } from "react-native";
import { RecipePage } from "../pages/RecipePage";

const Stack = createStackNavigator();

const ProfileStack = ({
  ip,
  userId,
  setUserId,
  setIndex,
  recipe,
  setRecipe,
}) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain">
      {(props) => (
        <ProfilePage
          {...props}
          ip={ip}
          userId={userId}
          setUserId={setUserId}
          setIndex={setIndex}
          setRecipe={setRecipe}
        />
      )}
    </Stack.Screen>
    <Stack.Screen name="SignUp">
      {(props) => (
        <SignUpPage {...props} ip={ip} userId={userId} setUserId={setUserId} />
      )}
    </Stack.Screen>
    <Stack.Screen name="Login">
      {(props) => (
        <LoginPage {...props} ip={ip} userId={userId} setUserId={setUserId} />
      )}
    </Stack.Screen>
    <Stack.Screen name="Camera">
      {(props) => <CameraPage {...props} ip={ip} userId={userId} />}
    </Stack.Screen>
    <Stack.Screen name="Scanner">
      {(props) => <ScannerPage {...props} ip={ip} userId={userId} />}
    </Stack.Screen>
    <Stack.Screen name="Preferences">
      {(props) => <PreferencesPage {...props} ip={ip} userId={userId} />}
    </Stack.Screen>
    <Stack.Screen name="Recipe">
      {(props) => (
        <RecipePage {...props} ip={ip} userId={userId} recipe={recipe} />
      )}
    </Stack.Screen>
    <Stack.Screen name="AddEntry">
      {(props) => <AddEntry {...props} ip={ip} userId={userId} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const routes = [
  { key: "profile", title: "Profile" },
  { key: "entries", title: "Inventory" },
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
            ip={ip}
            userId={userId}
            setUserId={setUserId}
            setIndex={setIndex}
            recipe={recipe}
            setRecipe={setRecipe}
            item={item}
            setItem={setItem}
            itemUri={itemUri}
            setItemUri={setItemUri}
          />
        );
      case "entries":
        return (
          <EntriesPage
            ip={ip}
            userId={userId}
            setUserId={setUserId}
            setIndex={setIndex}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#52B788" }}
      style={{ backgroundColor: "#52B788", fontSize: 46 }}
    />
  );

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
