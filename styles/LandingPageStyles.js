import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const landingStyles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: "100%",
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
  statisticsBox: {
    width: "85%",
    backgroundColor: "#52B788",
    padding: "5%",
    marginTop: "5%",
    borderRadius: 10,
    alignItems: "center",
  },
  banner: {
    width: "100%",
    backgroundColor: "#5295B7FF",
    padding: "10%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
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
  welcomeText: {
    fontSize: 22,
    textAlign: "center",
    color: "#FFFFFF",
    marginTop: 30,
    paddingLeft: 5,
    paddingRight: 5,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#52B788",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#52B788",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerTextLeft: {
    fontSize: 10,
    color: "#fffefeff",
  },
  footerTextRight: {
    fontSize: 10,
    color: "#fffefeff",
  },
});