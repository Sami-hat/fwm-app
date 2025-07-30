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
        marginTop: 10,
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
        margin: "auto"
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
    quantity: {
        fontSize: 16,
        color: "#555",
        marginVertical: 5,
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
        width: '88%',
    },
    deleteButton: {
        backgroundColor: "#FF5261FF",
    },
    editButton: {
        backgroundColor: "#FFB300",
    },
});