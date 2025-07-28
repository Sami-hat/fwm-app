import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text } from "@rneui/themed";
import { authService } from "../services/apiService";

export const SignUpPage = ({ setUserId }) => {
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
        setUserId(data.userId); // Set the user ID
        navigation.goBack();
        Alert.alert("Success", "Account created successfully!");
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
    <SafeAreaView style={styles.container}>
      <Text h3 style={styles.title}>
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
        leftIconContainerStyle={styles.leftIconContainer}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
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
        leftIconContainerStyle={styles.leftIconContainer}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        onChangeText={setPassword}
        errorMessage={error && error.includes("Password") ? error : ""}
      />

      <Button
        title="Sign Up"
        onPress={() => handleSignup(email, password)}
        buttonStyle={styles.signupButton}
        titleStyle={styles.buttonTitle}
        loading={loading}
        disabled={loading}
      />

      <Button
        style={{ paddingTop: 10 }}
        title="Back to Profile"
        type="clear"
        titleStyle={styles.backText}
        onPress={() => navigation.goBack()}
      />

      {error && !error.includes("email") && !error.includes("Password") ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    height: 50,
    alignItems: "center",
  },
  inputText: {
    fontSize: 16,
    paddingLeft: 10,
  },
  leftIconContainer: {
    marginLeft: 5,
    marginRight: 5,
  },
  signupButton: {
    backgroundColor: "#52B788",
    width: 200,
    marginTop: 10,
    borderRadius: 25,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backText: {
    color: "#5295B7",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default SignUpPage;