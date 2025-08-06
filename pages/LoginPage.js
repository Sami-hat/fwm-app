import { loginStyles } from "../styles/LoginPageStyles";
import { authService } from "../services/apiService";

import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text } from "@rneui/themed";

export const LoginPage = ({ userId, setUserId }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await authService.login(email.trim(), password);

      if (data.userId) {
        setUserId(data.userId);
        navigation.navigate("Home");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle specific error messages
      if (
        error.message.includes("Invalid credential") ||
        error.message.includes("Invalid credentials")
      ) {
        setError("Invalid email or password");
      } else if (error.message.includes("Network")) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <Text h3 style={loginStyles.title}>
        Log In
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
        leftIconContainerStyle={loginStyles.leftIconContainer}
        inputContainerStyle={loginStyles.inputContainer}
        inputStyle={loginStyles.inputText}
        onChangeText={setEmail}
        errorMessage={error && error.includes("email") ? error : ""}
      />

      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        leftIcon={{
          type: "font-awesome",
          name: "lock",
          color: "#52B788",
          size: 22,
        }}
        leftIconContainerStyle={loginStyles.leftIconContainer}
        inputContainerStyle={loginStyles.inputContainer}
        inputStyle={loginStyles.inputText}
        onChangeText={setPassword}
        errorMessage={error && error.includes("password") ? error : ""}
      />

      <Button
        title="Log In"
        onPress={() => handleLogin(email, password)}
        buttonStyle={loginStyles.loginButton}
        titleStyle={loginStyles.buttonTitle}
        loading={loading}
        disabled={loading}
      />

      <Button
        style={{ paddingTop: 10 }}
        title="Back to Profile"
        type="clear"
        titleStyle={loginStyles.backText}
        onPress={() => navigation.goBack()}
      />

      {error && !error.includes("email") && !error.includes("password") ? (
        <Text style={loginStyles.errorText}>{error}</Text>
      ) : null}
    </SafeAreaView>
  );
};

export default LoginPage;
