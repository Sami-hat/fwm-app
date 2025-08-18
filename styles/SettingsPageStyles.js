import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  safeAreaView: {
    flex: 1,
  },
  title: {
    marginBottom: 20,
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  emailVerificationText: {
    color: 'orange',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    marginBottom: 10,
    width: windowWidth * 0.85,
    height: windowHeight * 0.07,
    borderRadius: 10,
  },
  logoutAllButton: {
    backgroundColor: '#b71c1c',
    width: windowWidth * 0.85,
    height: windowHeight * 0.07,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  button: {
    width: windowWidth * 0.85,
    height: windowHeight * 0.07,
    marginTop: "6%",
    marginBottom: "2%",
    borderRadius: 10,
  },
  titleBlack: {
    textAlign: "center",
    marginBottom: 10,
  },
});