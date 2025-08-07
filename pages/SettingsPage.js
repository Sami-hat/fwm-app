import { profileStyles } from "../styles/ProfilePageStyles";

import { React, useState, useEffect } from "react";
import { Header } from "../components/Header";
import { View } from "react-native";
import { Button, Text } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";

const SettingsPage = ({ userId, setUserId, setIndex }) => {
    const handleLogout = async () => {
        setUserId(0);
        setIndex(0);
    };

    return (
        <View style={{ ...profileStyles.container, backgroundColor: 'white'}}>
            <Text h3 style={profileStyles.statisticsTitleBlack}>
                Your Settings
            </Text>
            <Button
                title="Log Out     "
                icon={<Feather name="log-out" size={18} color="white" />}
                iconRight
                onPress={() => handleLogout()}
                buttonStyle={{
                    ...profileStyles.button,
                    backgroundColor: "#5295B7FF",
                }}
                titleStyle={profileStyles.buttonText}
            />
        </View>
    );
};

export default SettingsPage;
