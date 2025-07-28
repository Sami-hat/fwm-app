import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

export const ScannerPage = ({ userId }) => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
      const { status } = await BarcodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarcodeScannerPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcode(data);

    try {
      fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      )
        .then((response) => response.json())
        .then((result) => {
          const name = result.product.product_name;
          const quantity = result.product.quantity;
          console.log(name + " quantity: " + quantity);
          fetch(
            `${ip}/inventory/add?user=${userId}&name=${name}&quantity=${quantity}&barcode=${data}`,
            {
              method: "POST",
            }
          )
            .then((response) => response.json())
            .catch((error) => console.error("Error adding entry:", error));
          if (result.status !== 1) {
            setProduct({ error: "Product not found." });
          }
        })
        .catch((error) => {
          console.error(error);
          setProduct({ error: "Error fetching product data." });
        });
    } catch (error) {
      console.error(error);
      setProduct({ error: "Error fetching product data." });
    }
  };

  if (hasPermission === null) {
    return (
      <View>
        <Text>No access to camera</Text>
        <Text style={styles.message}>
          We need permission to use your camera. Turn it on pretty please...
        </Text>
        <Button
          onPress={() => setHasPermission(true)}
          title="grant permission"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.back_button}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      <Text style={styles.scannedText}>Scanned Code: {barcode}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scannedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  shutterContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  back_button: {
    flex: 1,
    alignSelf: "flex-start",
    alignItems: "left",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
