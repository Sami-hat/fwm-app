import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 30,
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    height: 50,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputText: {
    fontSize: 16,
    paddingLeft: 10,
    color: "#333",
  },
  leftIconContainer: {
    marginLeft: 5,
    marginRight: 5,
  },
  signupButton: {
    backgroundColor: "#52B788",
    width: windowWidth * 0.6,
    height: 50,
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  passwordHint: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 20,
    lineHeight: 16,
  },
  backText: {
    color: "#5295B7",
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    color: "#d32f2f",
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    paddingHorizontal: 20,
  },
  successText: {
    color: "#52B788",
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
  },
  passwordStrengthContainer: {
    width: "100%",
    marginTop: 5,
    paddingHorizontal: 20,
  },
  passwordStrengthBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
  },
  passwordStrengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    textAlign: "center",
  },
});