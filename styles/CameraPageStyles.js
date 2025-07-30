import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const CameraStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  shutterContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  back_button: {
    flex: 1,
    alignSelf: "flex-start",
    alignItems: "left",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});