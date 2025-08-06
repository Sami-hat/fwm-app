import { signUpStyles } from "../styles/SignUpPageStyles";
import { authService } from "../services/apiService";

import React, { useState } from "react";
import { SafeAreaView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text } from "@rneui/themed";

const SignUpPage = ({ setUserId }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (email, password) => {
    // Input validation
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      setError(""); // Clear any previous errors

      const data = await authService.signup(email.trim(), password);

      if (data.userId) {
        setUserId(data.userId);
        navigation.navigate("Home");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);

      // Handle specific error messages
      if (error.message.includes("User already exists")) {
        setError("An account with this email already exists");
      } else if (error.message.includes("Invalid email")) {
        setError("Please enter a valid email address");
      } else if (error.message.includes("Password")) {
        setError("Password requirements not met");
      } else if (error.message.includes("Network")) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={signUpStyles.container}>
      <Text h3 style={signUpStyles.title}>
        Sign Up
      </Text>

      <Input
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        leftIcon={{
          type: "font-awesome",
          name: "envelope",
          color: "#52B788",
          size: 20,
        }}
        leftIconContainerStyle={signUpStyles.leftIconContainer}
        inputContainerStyle={signUpStyles.inputContainer}
        inputStyle={signUpStyles.inputText}
        onChangeText={setEmail}
        errorMessage={error && error.includes("email") ? error : ""}
      />

      <Input
        placeholder="Password (min 6 characters)"
        secureTextEntry
        value={password}
        leftIcon={{
          type: "font-awesome",
          name: "lock",
          color: "#52B788",
          size: 22,
        }}
        leftIconContainerStyle={signUpStyles.leftIconContainer}
        inputContainerStyle={signUpStyles.inputContainer}
        inputStyle={signUpStyles.inputText}
        onChangeText={setPassword}
        errorMessage={error && error.includes("Password") ? error : ""}
      />

      <Button
        title="Sign Up"
        onPress={() => handleSignup(email, password)}
        buttonStyle={signUpStyles.signupButton}
        titleStyle={signUpStyles.buttonTitle}
        loading={loading}
        disabled={loading}
      />

      <Button
        style={{ paddingTop: 10 }}
        title="Back to Profile"
        type="clear"
        titleStyle={signUpStyles.backText}
        onPress={() => navigation.goBack()}
      />

      {error && !error.includes("email") && !error.includes("Password") ? (
        <Text style={signUpStyles.errorText}>{error}</Text>
      ) : null}
    </SafeAreaView>
  );
};
