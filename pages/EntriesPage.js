import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Dimensions,
    FlatList,
    View,
    Alert,
} from "react-native";
import { Button, Input, Text, Card } from "@rneui/themed";
import { Header } from "../components/Header";
import { inventoryService } from "../services/apiService";

export const EntriesPage = ({ userId }) => {
    const [inventory, setInventory] = useState([]);
    const [isPosting, setIsPosting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState(null);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [barcode, setBarcode] = useState("");

    // Get user's inventory
    useEffect(() => {
        if (userId >= 1) {
            loadInventory();
        }
    }, [userId]);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getAll(userId);
            setInventory(data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
            Alert.alert("Error", "Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    // Delete entry
    const deleteEntry = async (id) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await inventoryService.delete(userId, id);
                            setInventory(inventory.filter((item) => item.id !== id));
                            Alert.alert("Success", "Item deleted successfully");
                        } catch (error) {
                            console.error("Error deleting entry:", error);
                            Alert.alert("Error", "Failed to delete item");
                        }
                    }
                }
            ]
        );
    };

    // Add entry 
    const addEntry = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Please enter an item name");
            return;
        }

        try {
            setLoading(true);
            await inventoryService.add(userId, name.trim(), quantity || "1", barcode || null);
            await loadInventory(); // Refresh inventory
            clearEntry();
            setIsPosting(false);
            setIsAdding(false);
            Alert.alert("Success", "Item added successfully");
        } catch (error) {
            console.error("Error adding entry:", error);
            Alert.alert("Error", "Failed to add item");
        } finally {
            setLoading(false);
        }
    };

    // Edit entry
    const editEntry = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Please enter an item name");
            return;
        }

        try {
            setLoading(true);
            await inventoryService.edit(userId, item, name.trim(), quantity || "1", barcode || null);
            await loadInventory(); // Refresh inventory
            clearEntry();
            setIsPosting(false);
            setIsEditing(false);
            Alert.alert("Success", "Item updated successfully");
        } catch (error) {
            console.error("Error editing entry:", error);
            Alert.alert("Error", "Failed to update item");
        } finally {
            setLoading(false);
        }
    };

    const clearEntry = () => {
        setItem(null);
        setName("");
        setQuantity("");
        setBarcode("");
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
            ) : isPosting ? (
                <View style={styles.content}>
                    <Text h4 style={styles.inputLabel}>
                        Name of Item:
                    </Text>
                    <Input
                        placeholder={isEditing ? "Edit item name" : "Enter item name"}
                        value={name}
                        onChangeText={setName}
                        inputContainerStyle={styles.inputContainer}
                    />
                    <Text h4 style={styles.inputLabel}>
                        Quantity:
                    </Text>
                    <Input
                        placeholder={isEditing ? "Edit quantity" : "Enter quantity"}
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                        inputContainerStyle={styles.inputContainer}
                    />
                    <Text h4 style={styles.inputLabel}>
                        Barcode Number:
                    </Text>
                    <Input
                        placeholder={isEditing ? "Edit barcode" : "Enter barcode (optional)"}
                        keyboardType="numeric"
                        value={barcode}
                        onChangeText={setBarcode}
                        inputContainerStyle={styles.inputContainer}
                    />

                    <Button
                        title={isAdding ? "Add Item" : "Update Item"}
                        onPress={isAdding ? addEntry : editEntry}
                        buttonStyle={styles.button}
                        loading={loading}
                    />
                    <Button
                        title="Cancel"
                        onPress={() => {
                            setIsPosting(false);
                            setIsAdding(false);
                            setIsEditing(false);
                            clearEntry();
                        }}
                        buttonStyle={[styles.button, { backgroundColor: "#666" }]}
                    />
                </View>
            ) : (
                <View style={styles.content}>
                    {loading ? (
                        <Text>Loading inventory...</Text>
                    ) : inventory.length === 0 ? (
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
                                        {item.barcode && (
                                            <Text style={styles.barcode}>
                                                Barcode: {item.barcode}
                                            </Text>
                                        )}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2}}>
                                            <Button
                                                title="Delete"
                                                buttonStyle={[styles.subButton, styles.deleteButton]}
                                                onPress={() => deleteEntry(item.id)}
                                            />
                                            <Button
                                                title="Edit"
                                                buttonStyle={[styles.subButton, styles.editButton]}
                                                onPress={() => {
                                                    setIsPosting(true);
                                                    setIsEditing(true);
                                                    setItem(item.id);
                                                    setName(item.name);
                                                    setQuantity(item.quantity?.toString() || "");
                                                    setBarcode(item.barcode?.toString() || "");
                                                }}
                                            />
                                        </View>
                                    </Card>
                                )}
                            />
                        </>
                    )}
                    <Button
                        title="Add Groceries Manually"
                        onPress={() => {
                            setIsPosting(true);
                            setIsAdding(true);
                            clearEntry();
                        }}
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

export default EntriesPage;