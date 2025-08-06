import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const preferencesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  checkboxContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: "normal",
  },
  saveButton: {
    backgroundColor: "#52B788",
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 10,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelText: {
    color: "#5295B7",
    fontSize: 16,
  },
});
