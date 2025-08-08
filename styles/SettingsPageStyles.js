import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const settingsStyles = StyleSheet.create({
  container: {
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: Dimensions.get("window").width * 0.85,
    height: Dimensions.get("window").height * 0.07,
    marginTop: "6%",
    marginBottom: "2%",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: "5%",
    color: "#FFFFFF",
  },
  titleBlack: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});
