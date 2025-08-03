import { profileStyles } from '../styles/ProfilePageStyles';

import { React, useState, useEffect } from "react";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { View, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { Button, Text, ListItem } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Alert } from 'react-native';

export const SettingsPage = ({ userId, setUserId, setIndex }) => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        setUserId(0);
        setIndex(0);
    };

    return (
        <View style={profileStyles.container}>
            <Header />
            <Text h3 style={profileStyles.statisticsTitleBlack}>
                Your Settings
            </Text>
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
    );
};

export default SettingsPage;