import { profileStyles } from '../styles/ProfilePageStyles';
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Button, Text } from "@rneui/themed";

export const LandingPage = ({ userId }) => {

    React.useEffect(() => {
        if (userId >= 1) {
            navigation.navigate('Home');
        }
    }, [userId]);

    const navigation = useNavigation();
    // Displayed if user not signed in
    return (
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
                    Sign in to access your grocery list, make amendments, and find out to effectively use the food products you own!
                </Text>
            </View>
        </View>
    );
};

export default LandingPage;