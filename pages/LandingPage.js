import { landingStyles } from "../styles/LandingPageStyles";

import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Button, Text } from "@rneui/themed";

// Landing Page, User is not signed in
const LandingPage = ({ userId }) => {
  React.useEffect(() => {
    if (userId >= 1) {
      navigation.navigate("Home");
    }
  }, [userId]);

  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <View style={landingStyles.banner}>
        <Text h3 style={landingStyles.welcomeText}>
          Welcome to Shelfie!
        </Text>
        <Text h5 style={landingStyles.welcomeText}>
          Please sign up or log in to access your profile.
        </Text>
      </View>

      <Button
        title="Sign Up"
        onPress={() => navigation.navigate("SignUp")}
        buttonStyle={{
          ...landingStyles.button,
          backgroundColor: "#5295B7FF",
        }}
        titleStyle={landingStyles.buttonText}
      />

      <Button
        title="Log In"
        onPress={() => navigation.navigate("Login")}
        buttonStyle={{
          ...landingStyles.button,
          backgroundColor: "#5295B7FF",
        }}
        titleStyle={landingStyles.buttonText}
      />

      <View style={landingStyles.statisticsBox}>
        <Text h3 style={landingStyles.statisticsTitle}>
          Your Statistics
        </Text>
        <Text style={landingStyles.statisticsText}>
          Sign in to access your grocery list, make amendments, and find out to
          effectively use the food products you own!
        </Text>
      </View>
      <View style={landingStyles.footer}>
        <Text style={landingStyles.footerTextLeft}>
          © {currentYear} Shelfie.
        </Text>
        <Text style={landingStyles.footerTextRight}>
          All rights reserved.
        </Text>
      </View>

    </View>
  );
};

export default LandingPage;
