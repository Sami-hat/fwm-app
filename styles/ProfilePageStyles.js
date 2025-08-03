import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const profileStyles  = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: "#52B788",
    height: Dimensions.get("window").height * 0.08,
    margin: "3%",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  loggedInButton: {
    width: Dimensions.get("window").width * 0.85,
    height: Dimensions.get("window").height * 0.07,
    marginVertical: "3%",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  statisticsBox: {
    width: "85%",
    backgroundColor: "#52B788",
    padding: "5%",
    marginTop: "5%",
    borderRadius: 10,
    alignItems: "center",
  },
  statisticsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: "5%",
    color: "#FFFFFF",
  },
  statisticsText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
    statisticsTitleBlack: {
      textAlign: "center",
      marginTop: 20,
      marginBottom: 10,
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
});