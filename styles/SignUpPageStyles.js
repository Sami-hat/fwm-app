import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    height: 50,
    alignItems: "center",
  },
  inputText: {
    fontSize: 16,
    paddingLeft: 10,
  },
  leftIconContainer: {
    marginLeft: 5,
    marginRight: 5,
  },
  signupButton: {
    backgroundColor: "#52B788",
    width: 200,
    marginTop: 10,
    borderRadius: 25,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backText: {
    color: "#5295B7",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});
