import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const homeStyles = StyleSheet.create({
  container: {
    paddingTop: 60,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    width: Dimensions.get("window").width * 0.85,
    height: Dimensions.get("window").height * 0.07,
    marginBottom: "3%",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  emptyText: {
    padding: 20,
    alignItems: "center"
  },
  banner: {
    width: "110%",
    backgroundColor: "#5295B7FF",
    padding: "7%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5%",
  },
  welcomeText: {
    fontSize: 22,
    textAlign: "center",
    color: "#FFFFFF",
    marginTop: 30,
    paddingLeft: 5,
    paddingRight: 5,
  },
  header: {
    fontSize: 30,
    textAlign: "left",
    lineHeight: 70,
    color: "black",
  },
  preferencesDisplay: {
    backgroundColor: "#f0f8ff",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#52B788",
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  preferencesText: {
    fontSize: 14,
    color: "#666",
  },
  recipeActionButtonContainer: {
    flexDirection: 'row',
    margin: 10,
    gap: 10
  },
  recipeActionButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
  },
  recipeActionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  generateRecipeButton: {
    backgroundColor: "#52B788",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  generateRecipeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  retryButton: {
    borderColor: "#FF6B6B",
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "white",
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
  },
});