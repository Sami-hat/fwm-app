import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text } from "@rneui/themed";

export const SignUpPage = ({ ip, setUserId }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (email, password) => {
    try {
      setError(""); // Clear any previous errors
      
      const response = await fetch(`${ip}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok && data.userId) {
        setUserId(data.userId); // Set the user ID
        navigation.goBack();
      } else {
        // Handle server errors (like "User already exists")
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("An error occurred during signup:", error);
      setError("Network error. Please try again.");
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
        value={email}
      />

      <Input
        placeholder="Password"
        secureTextEntry
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
        value={password}
      />

      <Button
        title="Sign Up"
        onPress={() => handleSignup(email, password)}
        buttonStyle={styles.signupButton}
        titleStyle={styles.buttonTitle}
      />

      <Button
        style={{ paddingTop: 10 }}
        title="Back to Profile"
        type="clear"
        titleStyle={styles.backText}
        onPress={() => navigation.goBack()}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  },
});

export default SignUpPage;