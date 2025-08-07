import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const preferencesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  
  checkboxText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333',
  },
  
  customInputContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  
  customInputWrapper: {
    paddingHorizontal: 0,
  },
  
  customInputInner: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  
  customInputText: {
    fontSize: 14,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingBottom: 10,
  },
  
  customInputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#52B788",
    borderRadius: 25,
    marginTop: 30,
    marginBottom: 10,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelText: {
    color: "#5295B7",
    fontSize: 16,
  },
});
