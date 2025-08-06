import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const entriesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "black",
    marginTop: 20,
    marginBottom: 10,
  },
  statisticsTitle: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  statisticsText: {
    textAlign: "center",
    color: "#555",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  inputLabel: {
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  inputContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  button: {
    width: Dimensions.get("window").width * 0.65,
    backgroundColor: "#52B788",
    borderRadius: 25,
    marginVertical: 15,
    textAlign: "center",
    justifyContent: "center",
    margin: "auto",
  },
  inventoryList: {
    width: Dimensions.get("window").width * 0.95,
  },
  entry: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    fontWeight: "bold",
  },

  barcode: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  subButton: {
    borderRadius: 10,
    marginTop: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "88%",
  },
  deleteButton: {
    backgroundColor: "#FF5261FF",
  },
  editButton: {
    backgroundColor: "#FFB300",
  },
  datePickerButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  datePickerText: {
    fontSize: 16,
    color: "#333",
  },

  expiry: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "500",
  },

  dateAdded: {
    fontSize: 12,
    marginTop: 3,
    color: "#888",
    fontStyle: "italic",
  },

  inputContainer: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  inputLabel: {
    marginLeft: 10,
    marginBottom: 5,
    color: "#333",
  },

  entry: {
    marginBottom: 10,
    borderRadius: 8,
    padding: 15,
  },

  item: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  quantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
});
