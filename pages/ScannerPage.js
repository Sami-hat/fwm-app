import { scannerStyles } from '../styles/ScannerPageStyles';

import React, { useState, useEffect } from "react";
import { Text, View, Button, scannerStylesheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { inventoryService } from "../services/apiService";
import { barcodeService } from "../services/apiService";

export const ScannerPage = ({ userId }) => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarcodeScannerPermissions();
  }, []);

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    setBarcode(data);
    setProcessing(true);

    try {
      // Fetch product information
      const result = await barcodeService.search(barcode);

      if (result.product) {
        const name = result.product.product_name || "Unknown Product";
        const quantity = result.product.quantity || "1";
        
        console.log(`Found product: ${name}, quantity: ${quantity}`);
        
        // Add to inventory using API service
        await inventoryService.add(userId, name, quantity, data);
        
        Alert.alert(
          "Product Added", 
          `Successfully added "${name}" to your inventory`,
          [
            { text: "OK" },
            { text: "Scan Another", onPress: () => setScanned(false) }
          ]
        );
      } else {
        // Product not found
        Alert.alert(
          "Product Not Found", 
          "This barcode was not found in our database. You can add it manually in your inventory.",
          [
            { text: "OK" },
            { text: "Scan Another", onPress: () => setScanned(false) }
          ]
        );
      }
    } catch (error) {
      console.error("Error processing barcode:", error);
      
      if (error.message.includes("Failed to add")) {
        Alert.alert("Error", "Failed to add item to inventory. Please try again.");
      } else if (error.message.includes("Failed to fetch")) {
        Alert.alert("Error", "Failed to lookup product information. Please try again or add manually.");
      } else {
        Alert.alert("Error", "Failed to process barcode. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={scannerStyles.container}>
        <Text style={scannerStyles.message}>
          Please enable camera permissions
        </Text>
        <Button
          onPress={() => Camera.requestCameraPermissionsAsync()}
          title="Grant Permission"
        />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={scannerStyles.container}>
        <Text style={scannerStyles.message}>No access to camera</Text>
        <Button
          onPress={() => Camera.requestCameraPermissionsAsync()}
          title="Request Permission"
        />
      </View>
    );
  }

  return (
    <View style={scannerStyles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        style={scannerStylesheet.absoluteFillObject}
      />
      <View style={scannerStyles.buttonContainer}>
        <TouchableOpacity
          style={scannerStyles.back_button}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {processing && (
        <View style={scannerStyles.processingContainer}>
          <Text style={scannerStyles.processingText}>Processing barcode...</Text>
        </View>
      )}
      
      {scanned && !processing && (
        <View style={scannerStyles.scannedContainer}>
          <Button 
            title="Tap to Scan Again" 
            onPress={() => setScanned(false)} 
            color="#52B788"
          />
        </View>
      )}
      
      {barcode ? (
        <Text style={scannerStyles.scannedText}>Scanned Code: {barcode}</Text>
      ) : null}
    </View>
  );
};

export default ScannerPage;