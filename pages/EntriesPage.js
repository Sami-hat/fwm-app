import { entriesStyles } from "../styles/EntriesPageStyles";
import { inventoryService } from "../services/apiService";

import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Button, Input, Text, Card } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Header } from "../components/Header";

const EntriesPage = ({ userId }) => {
  const [inventory, setInventory] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [barcode, setBarcode] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle date picker change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setExpiryDate(selectedDate);
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
            } catch (error) {
              console.error("Error deleting entry:", error);
              Alert.alert("Error", "Failed to delete item");
            }
          },
        },
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
      await inventoryService.add(
        userId,
        name.trim(),
        quantity || "1",
        barcode || null,
        expiryDate ? formatDate(expiryDate) : null
      );
      await loadInventory(); // Refresh inventory
      clearEntry();
      setIsPosting(false);
      setIsAdding(false);
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
      await inventoryService.edit(
        userId,
        item,
        name.trim(),
        quantity || "1",
        barcode || null,
        expiryDate ? formatDate(expiryDate) : null
      );
      await loadInventory(); // Refresh inventory
      clearEntry();
      setIsPosting(false);
      setIsEditing(false);
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
    setExpiryDate(null);
  };

  // Parse date from DD/MM/YYYY format
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/");
    return new Date(year, month - 1, day);
  };

  // Status color for expiry
  const getExpiryColor = (item) => {
    if (item.is_expired) return "#FF6B6B";
    if (item.expires_soon) return "#FFA500";
    return "#666";
  };

  return (
    <View style={entriesStyles.container}>
      <Header />

      {/* Main Content Section */}
      {isPosting ? (
        <View style={entriesStyles.content}>
          <Text h4 style={entriesStyles.inputLabel}>
            Name of Item:
          </Text>
          <Input
            placeholder={isEditing ? "Edit item name" : "Enter item name"}
            value={name}
            onChangeText={setName}
            inputContainerStyle={entriesStyles.inputContainer}
          />
          <Text h4 style={entriesStyles.inputLabel}>
            Quantity:
          </Text>
          <Input
            placeholder={isEditing ? "Edit quantity" : "Enter quantity"}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            inputContainerStyle={entriesStyles.inputContainer}
          />
          <Text h4 style={entriesStyles.inputLabel}>
            Barcode Number:
          </Text>
          <Input
            placeholder={
              isEditing ? "Edit barcode" : "Enter barcode (optional)"
            }
            keyboardType="numeric"
            value={barcode}
            onChangeText={setBarcode}
            inputContainerStyle={entriesStyles.inputContainer}
          />
          <Text h4 style={entriesStyles.inputLabel}>
            Expiry Date:
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={entriesStyles.datePickerButton}
          >
            <Text style={entriesStyles.datePickerText}>
              {expiryDate
                ? formatDate(expiryDate)
                : "Select expiry date (optional)"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={expiryDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          <Button
            title={isAdding ? "Add Item" : "Update Item"}
            onPress={isAdding ? addEntry : editEntry}
            buttonStyle={entriesStyles.button}
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
            buttonStyle={[entriesStyles.button, { backgroundColor: "#666" }]}
          />
        </View>
      ) : (
        <View style={entriesStyles.content}>
          {loading ? (
            <Text>Loading inventory...</Text>
          ) : inventory.length === 0 ? (
            <>
              <Text h3 style={entriesStyles.statisticsTitle}>
                Your Groceries
              </Text>
              <Text style={entriesStyles.statisticsText}>
                You have not recorded any shopping trips. To add to your
                inventory, take a picture of your shopping or scan one of their
                barcodes.
              </Text>
            </>
          ) : (
            <>
              <Text h3 style={entriesStyles.title}>
                Your Groceries
              </Text>
              <FlatList
                data={inventory}
                keyExtractor={(item) => item.id.toString()}
                style={entriesStyles.inventoryList}
                renderItem={({ item }) => (
                  <Card
                    containerStyle={[
                      entriesStyles.entry,
                      item.is_expired && {
                        borderColor: "#FF6B6B",
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <Text style={entriesStyles.item}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Text>
                    <Text style={entriesStyles.quantity}>
                      Quantity: {item.quantity}
                    </Text>
                    {item.formatted_expiry_date && (
                      <Text
                        style={[
                          entriesStyles.expiry,
                          { color: getExpiryColor(item) },
                        ]}
                      >
                        Expires: {item.formatted_expiry_date}
                        {item.is_expired && " (EXPIRED)"}
                        {!item.is_expired && item.expires_soon && " (Soon)"}
                      </Text>
                    )}
                    {item.formatted_date_added && (
                      <Text style={entriesStyles.dateAdded}>
                        Added: {item.formatted_date_added}
                        {item.days_in_inventory &&
                          ` (${Math.floor(item.days_in_inventory)} days ago)`}
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: 2,
                      }}
                    >
                      <Button
                        title="Delete"
                        buttonStyle={[
                          entriesStyles.subButton,
                          entriesStyles.deleteButton,
                        ]}
                        onPress={() => deleteEntry(item.id)}
                      />
                      <Button
                        title="Edit"
                        buttonStyle={[
                          entriesStyles.subButton,
                          entriesStyles.editButton,
                        ]}
                        onPress={() => {
                          setIsPosting(true);
                          setIsEditing(true);
                          setItem(item.id);
                          setName(item.name);
                          setQuantity(item.quantity?.toString() || "");
                          setBarcode(item.barcode?.toString() || "");
                          setExpiryDate(parseDate(item.formatted_expiry_date));
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
            buttonStyle={entriesStyles.button}
          />
        </View>
      )}
    </View>
  );
};

export default EntriesPage;
