import { scannerStyles } from "../styles/ScannerPageStyles";
import { inventoryService, barcodeService } from "../services/apiService";

import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export const ScannerPage = ({ userId }) => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleBarcodeScanned = async ({ type, data }) => {
    console.log("Barcode scanned:", { type, data });
    setScanned(true);
    setBarcode(data);
    setProcessing(true);

    try {
      // Fetch product information
      const result = await barcodeService.search(data);
      console.log("Barcode service result:", result);

      if (result.found && result.product) {
        const name = result.product.product_name || "Unknown Product";
        const quantity = result.product.quantity || "1";
        const expriation_date = result.product.expriation_date || "";

        console.log(
          `Found product: ${name}, quantity: ${quantity}, expiration date: ${expriation_date}`
        );

        // Add to inventory using API service
        await inventoryService.add(
          userId,
          name,
          quantity,
          data,
          expriation_date
        );

        Alert.alert(
          "Product Added",
          `Successfully added "${name}" to your inventory`,
          [
            { text: "OK" },
            { text: "Scan Another", onPress: () => setScanned(false) },
          ]
        );
      } else {
        // Product not found
        Alert.alert(
          "Product Not Found",
          "This barcode was not found in our database. You can add it manually in your inventory.",
          [
            { text: "OK" },
            { text: "Scan Another", onPress: () => setScanned(false) },
          ]
        );
      }
    } catch (error) {
      console.error("Error processing barcode:", error);

      if (error.message.includes("Failed to add")) {
        Alert.alert(
          "Error",
          "Failed to add item to inventory. Please try again."
        );
      } else if (error.message.includes("Failed to search")) {
        Alert.alert(
          "Error",
          "Failed to lookup product information. Please try again or add manually."
        );
      } else {
        Alert.alert("Error", "Failed to process barcode. Please try again.");
      }
    } finally {
      setProcessing(false);
    }
  };

  // Check permission status
  if (!permission) {
    // Camera permissions loading
    return (
      <View style={scannerStyles.container}>
        <Text style={scannerStyles.message}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={scannerStyles.container}>
        <Text style={scannerStyles.message}>
          We need camera permission to scan barcodes
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Camera permissions are granted
  return (
    <View style={scannerStyles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "pdf417",
            "ean13",
            "ean8",
            "code128",
            "code39",
            "upc_a",
            "upc_e",
          ],
        }}
      />

      {/* Back button */}
      <View style={scannerStyles.buttonContainer}>
        <TouchableOpacity
          style={scannerStyles.back_button}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Processing overlay */}
      {processing && (
        <View style={scannerStyles.processingContainer}>
          <Text style={scannerStyles.processingText}>
            Processing barcode...
          </Text>
        </View>
      )}

      {/* Scan again button */}
      {scanned && !processing && (
        <View style={scannerStyles.scannedContainer}>
          <Button
            title="Tap to Scan Again"
            onPress={() => setScanned(false)}
            color="#52B788"
          />
        </View>
      )}

      {/* Display scanned barcode */}
      {barcode ? (
        <View style={scannerStyles.barcodeDisplay}>
          <Text style={scannerStyles.scannedText}>Scanned: {barcode}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default ScannerPage;
