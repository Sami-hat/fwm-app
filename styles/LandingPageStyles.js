import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const landingStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F5F5F5",
  },

  banner: {
    width: "100%",
    height: windowHeight * 0.20,
    backgroundColor: "#5295B7FF",
    padding: "10%",
    paddingTop: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: windowWidth * 0.85,
    height: windowHeight * 0.07,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: windowWidth * 0.85,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statisticsBox: {
    width: "85%",
    backgroundColor: "#52B788",
    padding: "5%",
    marginTop: 30,
    marginBottom: 80,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  statisticsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  statisticsText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 22,
  },
  welcomeText: {
    fontSize: 24,
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 10,
    fontWeight: "bold",
  },
  welcomeSubtext: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFFFFF",
    paddingHorizontal: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#52B788",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#4a9d7a",
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