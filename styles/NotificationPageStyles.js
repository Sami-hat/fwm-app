import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const notificationStyles = StyleSheet.create({
  banner: {
    backgroundColor: "#FFA500",
    padding: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  urgentBanner: {
    backgroundColor: "#FF6B6B",
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  bannerSubtitle: {
    color: "white",
    fontSize: 12,
    opacity: 0.9,
  },
  dismissButton: {
    padding: 5,
  },
  dismissText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
