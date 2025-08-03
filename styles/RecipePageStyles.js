import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const recipeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    height: windowHeight,
    overflow: "hidden"
  },
  recipeContainer: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  displayText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#52B788",
    alignItems: "center",
    borderRadius: 25,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 12,
    alignSelf: "center",
    width: "90%",
  },
  iconButton: {
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  modalButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  openButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
});
