import { entriesStyles } from "../styles/EntriesPageStyles";
import { inventoryService } from "../services/apiService";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useCache } from '../hooks/useCache';
import { useCancellableRequest } from '../hooks/useCancellableRequest';
import {
  FlatList,
  View,
  Alert,
  Platform,
  TouchableOpacity,
  TextInput, 
  Text, 
  Card
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAuth } from '../contexts/AuthContext';

// Memoised inventory card component
const InventoryCard = memo(({ item, onDelete, onEdit, formatDate, getExpiryColor }) => (
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
      <TouchableOpacity
        title="Delete"
        buttonStyle={[
          entriesStyles.subButton,
          entriesStyles.deleteButton,
        ]}
        onPress={() => onDelete(item.id, item.is_expired)}
      />
      <TouchableOpacity
        title="Edit"
        buttonStyle={[
          entriesStyles.subButton,
          entriesStyles.editButton,
        ]}
        onPress={() => onEdit(item)}
      />
    </View>
  </Card>
));

const EntriesPage = ({ }) => {
  const { user } = useAuth();
  const userId = user?.id;

  // Caching and cancellation hooks
  const { getCached, setCached, invalidate } = useCache(3); // 3 minute TTL for inventory
  const { createCancellableRequest, cancelPendingRequests } = useCancellableRequest();

  const [inventory, setInventory] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [processing, setProcessing] = useState(false);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPendingRequests();
    };
  }, [cancelPendingRequests]);

  const loadInventory = useCallback(async () => {
    const cacheKey = `inventory_${userId}`;
    const cached = getCached(cacheKey);

    if (cached) {
      setInventory(cached);
      return;
    }

    try {
      setProcessing(true);
      const cancellableRequest = createCancellableRequest(async () => {
        return await inventoryService.getAll(userId);
      });

      const data = await cancellableRequest();
      if (data) {
        setInventory(data);
        setCached(cacheKey, data);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      Alert.alert("Error", "Failed to load inventory");
    } finally {
      setProcessing(false);
    }
  }, [userId, getCached, setCached, createCancellableRequest]);

  // Memoised utility functions
  const formatDate = useCallback((date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const parseDate = useCallback((dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/");
    return new Date(year, month - 1, day);
  }, []);

  const getExpiryColor = useCallback((item) => {
    if (item.is_expired) return "#FF6B6B";
    if (item.expires_soon) return "#FFA500";
    return "#666";
  }, []);

  // Handle date picker
  const onDateChange = useCallback((event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  }, []);

  // Delete entry
  const deleteEntry = useCallback(async (id, expired) => {
    // Quick delete if product expired
    if (expired) {
      try {
        await inventoryService.delete(userId, id);
        setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));

        // Invalidate cache after deleting
        invalidate(`inventory_${userId}`);
        invalidate(`inventory_names_${userId}`);
      } catch (error) {
        console.error("Error deleting entry:", error);
        Alert.alert("Error", "Failed to delete item");
      }
    } else {
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
                setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));

                // Invalidate cache after deleting
                invalidate(`inventory_${userId}`);
                invalidate(`inventory_names_${userId}`);
              } catch (error) {
                console.error("Error deleting entry:", error);
                Alert.alert("Error", "Failed to delete item");
              }
            },
          },
        ],
      );
    }
  }, [userId, invalidate]);

  const clearEntry = useCallback(() => {
    setItem(null);
    setName("");
    setQuantity("");
    setBarcode("");
    setExpiryDate(null);
  }, []);

  // Add entry
  const addEntry = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    try {
      setProcessing(true);
      await inventoryService.add(
        userId,
        name.trim(),
        quantity || "1",
        barcode || null,
        expiryDate ? formatDate(expiryDate) : null,
      );

      // Invalidate cache after adding
      invalidate(`inventory_${userId}`);
      invalidate(`inventory_names_${userId}`);

      await loadInventory(); // Refresh inventory
      clearEntry();
      setIsPosting(false);
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding entry:", error);
      Alert.alert("Error", "Failed to add item");
    } finally {
      setProcessing(false);
    }
  }, [userId, name, quantity, barcode, expiryDate, formatDate, loadInventory, clearEntry, invalidate]);

  // Edit entry
  const editEntry = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    try {
      setProcessing(true);
      await inventoryService.edit(
        userId,
        item,
        name.trim(),
        quantity || "1",
        barcode || null,
        expiryDate ? formatDate(expiryDate) : null,
      );

      // Invalidate cache after editing
      invalidate(`inventory_${userId}`);
      invalidate(`inventory_names_${userId}`);

      await loadInventory(); // Refresh inventory
      clearEntry();
      setIsPosting(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing entry:", error);
      Alert.alert("Error", "Failed to update item");
    } finally {
      setProcessing(false);
    }
  }, [userId, item, name, quantity, barcode, expiryDate, formatDate, loadInventory, clearEntry, invalidate]);

  // Handle editing an item
  const handleEdit = useCallback((itemToEdit) => {
    setIsPosting(true);
    setIsEditing(true);
    setItem(itemToEdit.id);
    setName(itemToEdit.name);
    setQuantity(itemToEdit.quantity?.toString() || "");
    setBarcode(itemToEdit.barcode?.toString() || "");
    setExpiryDate(parseDate(itemToEdit.formatted_expiry_date));
  }, [parseDate]);

  // Memoised render function for FlatList
  const renderInventoryItem = useCallback(({ item }) => (
    <InventoryCard
      item={item}
      onDelete={deleteEntry}
      onEdit={handleEdit}
      formatDate={formatDate}
      getExpiryColor={getExpiryColor}
    />
  ), [deleteEntry, handleEdit, formatDate, getExpiryColor]);

  return (
    <View style={entriesStyles.container}>

      {/* Main Content Section */}
      {isPosting ? (
        <View style={entriesStyles.content}>
          <Text style={entriesStyles.inputLabel}>
            Name of Item:
          </Text>
          <TextInput
            placeholder={isEditing ? "Edit item name" : "Enter item name"}
            value={name}
            onChangeText={setName}
            inputContainerStyle={entriesStyles.inputContainer}
          />
          <Text style={entriesStyles.inputLabel}>
            Quantity:
          </Text>
          <TextInput
            placeholder={isEditing ? "Edit quantity" : "Enter quantity"}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            inputContainerStyle={entriesStyles.inputContainer}
          />
          <Text style={entriesStyles.inputLabel}>
            Barcode Number:
          </Text>
          <TextInput
            placeholder={
              isEditing ? "Edit barcode" : "Enter barcode (optional)"
            }
            keyboardType="numeric"
            value={barcode}
            onChangeText={setBarcode}
            inputContainerStyle={entriesStyles.inputContainer}
          />
          <Text style={entriesStyles.inputLabel}>
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

          <TouchableOpacity
            title={isAdding ? "Add Item" : "Update Item"}
            onPress={isAdding ? addEntry : editEntry}
            buttonStyle={entriesStyles.button}
            loading={processing}
          />
          <TouchableOpacity
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
          {processing ? (
            <Text>Loading inventory...</Text>
          ) : inventory.length === 0 ? (
            <>
              <Text style={entriesStyles.statisticsTitle}>
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
              <Text style={entriesStyles.title}>
                Your Groceries
              </Text>
              <FlatList
                data={inventory}
                keyExtractor={(item) => item.id.toString()}
                style={entriesStyles.inventoryList}
                renderItem={renderInventoryItem}
              />
            </>
          )}
          <TouchableOpacity
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
