import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const scannerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scannedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
  },
  processingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  processingContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
  },
  scannedContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
    margin: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  back_button: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 10,
  },
});
