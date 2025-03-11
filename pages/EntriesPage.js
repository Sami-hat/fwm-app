import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Dimensions,
    FlatList,
    View,
} from "react-native";
import { Button, Input, Text, Card } from "@rneui/themed";
import { Header } from "../components/Header";

export const EntriesPage = ({ ip, userId }) => {
    const [inventory, setInventory] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [name, setName] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [barcode, setBarcode] = useState(null);

    // Get user's inventory
    useEffect(() => {
        if (userId >= 1) {
            fetch(`http://${ip}:3001/api/inventory?user=${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    setInventory(data);
                })
                .catch((error) => console.error("Error fetching userID:", error));
        }
    }, [userId, added]);

    // Delete entry
    const deleteEntry = async (id) => {
        fetch(`http://${ip}:3001/api/inventory/delete?user=${userId}&id=${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Deleted:", data);
                setInventory(inventory.filter((item) => item.id !== id));
            })
            .catch((error) => console.error("Error deleting entry:", error));
    };

    // Add entry 
    const addEntry = async () => {
        setIsAdding(true);
        console.log("userId:", userId);
        fetch(
            `http://${ip}:3001/api/inventory/add?user=${userId}&name=${name}&quantity=${quantity}&barcode=${barcode}`,
            {
                method: "POST",
            }
        )
            .then((response) => response.json())
            .then((data) => {
                setAdded(!added);
                setIsAdding(false);
            })
            .catch((error) => console.error("Error adding entry:", error));
    };

    return (
        <View style={styles.container}>
            <Header />

            {/* Main Content Section */}
            {userId < 1 ? (
                <View style={styles.content}>
                    <Text h3 style={styles.statisticsTitle}>
                        Your Groceries
                    </Text>
                    <Text style={styles.statisticsText}>
                        Make an account or log in to see inventory. Once you make an
                        account, you will be able to see your groceries here.
                    </Text>
                </View>
            ) : isAdding ? (
                <View style={styles.content}>
                    <Text h4 style={styles.inputLabel}>
                        Name of Item:
                    </Text>
                    <Input
                        placeholder="Enter item name"
                        value={name}
                        onChangeText={setName}
                        inputContainerStyle={styles.inputContainer}
                    />
                    <Text h4 style={styles.inputLabel}>
                        Quantity:
                    </Text>
                    <Input
                        placeholder="Enter quantity"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                        inputContainerStyle={styles.inputContainer}
                    />
                    <Text h4 style={styles.inputLabel}>
                        Barcode Number:
                    </Text>
                    <Input
                        placeholder="Enter barcode"
                        keyboardType="numeric"
                        value={barcode}
                        onChangeText={setBarcode}
                        inputContainerStyle={styles.inputContainer}
                    />

                    <Button
                        title="Submit"
                        onPress={addEntry}
                        buttonStyle={styles.button}
                    />
                    <Button
                        title="Back to Inventory"
                        onPress={() => setIsAdding(false)}
                        buttonStyle={styles.button}
                    />
                </View>
            ) : (
                <View style={styles.content}>
                    {inventory.length === 0 ? (
                        <>
                            <Text h3 style={styles.statisticsTitle}>
                                Your Groceries
                            </Text>
                            <Text style={styles.statisticsText}>
                                You have not recorded any shopping trips. To add to your
                                inventory, take a picture of your shopping or scan one of their
                                barcodes.
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text h3 style={styles.title}>
                                Your Groceries
                            </Text>
                            <FlatList
                                data={inventory}
                                keyExtractor={(item) => item.id.toString()}
                                style={styles.inventoryList}
                                renderItem={({ item }) => (
                                    <Card containerStyle={styles.entry}>
                                        <Text style={styles.item}>
                                            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                        </Text>
                                        <Text style={styles.quantity}>
                                            Quantity: {item.quantity}
                                        </Text>
                                        <Button
                                            title="Delete"
                                            buttonStyle={styles.deleteButton}
                                            onPress={() => deleteEntry(item.id)}
                                        />
                                    </Card>
                                )}
                            />
                        </>
                    )}
                    <Button
                        title="Add Groceries Manually"
                        onPress={() => setIsAdding(true)}
                        buttonStyle={styles.button}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: "#52B788",
        borderRadius: 25,
        marginVertical: 10,
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
    deleteButton: {
        backgroundColor: "#FF5261FF",
        borderRadius: 10,
        marginTop: 10,
    },
});

export default EntriesPage;
