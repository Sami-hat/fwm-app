import { cameraStyles } from "../styles/CameraPageStyles";

import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Text } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";

import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { recipeService, inventoryService } from "../services/apiService";

const CameraPage = ({ userId }) => {
  const navigation = useNavigation();
  const [type, setType] = useState("back");
  const [hasPermission, setHasPermission] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  // Request permissions on mount
  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const processImage = async (imageUri) => {
    setIsProcessing(true);
    try {
      const result = await recipeService.analyzeImage(imageUri);

      if (
        result.segmentation_results &&
        result.segmentation_results[0] &&
        result.segmentation_results[0].recognition_results &&
        result.segmentation_results[0].recognition_results.length > 0
      ) {
        const detectedItems =
          result.segmentation_results[0].recognition_results;
        const itemNames = detectedItems.map((item) => item.name).join(", ");

        Alert.alert("Items Detected", `Found: ${itemNames}`, [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setPhotoUri(null),
          },
          {
            text: "Add to Inventory",
            onPress: async () => {
              await addItemsToInventory(detectedItems);
              setPhotoUri(null);
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert(
          "No Items Detected",
          "Could not identify any food items in the image. Try taking a clearer photo.",
          [{ text: "OK", onPress: () => setPhotoUri(null) }],
        );
      }
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert(
        "Processing Error",
        "Failed to analyze the image. Please try again.",
        [{ text: "OK", onPress: () => setPhotoUri(null) }],
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const addItemsToInventory = async (items) => {
    try {
      for (const item of items) {
        await inventoryService.add(userId, item.name, "1", null, null);
      }
      Alert.alert("Success", "Items added to inventory!");
    } catch (error) {
      console.error("Error adding to inventory:", error);
      Alert.alert("Error", "Failed to add items to inventory");
    }
  };

  if (hasPermission === null) {
    return <View style={cameraStyles.container} />;
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={cameraStyles.permissionContainer}>
        <View style={cameraStyles.permissionContent}>
          <Ionicons name="camera-outline" size={80} color="#52B788" />
          <Text h3 style={cameraStyles.permissionTitle}>
            Camera Permission Required
          </Text>
          <Text style={cameraStyles.permissionText}>
            We need access to your camera to take photos of your groceries
          </Text>
          <TouchableOpacity
            style={cameraStyles.permissionButton}
            onPress={async () => {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === "granted");
            }}
          >
            <Text style={cameraStyles.permissionButtonText}>
              Grant Permission
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={cameraStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={cameraStyles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraType = () => {
    setType((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 0.8,
          base64: false,
          skipProcessing: true,
        };

        const photo = await cameraRef.current.takePictureAsync(options);
        console.log("Photo taken:", photo.uri);
        setPhotoUri(photo.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert(
          "Camera Error",
          "Failed to take picture. Please try again.",
        );
      }
    } else {
      console.error("Camera ref not available");
    }
  };

  const renderPhotoPreview = () => {
    return (
      <SafeAreaView style={cameraStyles.previewContainer}>
        <View style={cameraStyles.previewHeader}>
          <TouchableOpacity
            style={cameraStyles.headerButton}
            onPress={() => setPhotoData(null)}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={cameraStyles.headerTitle}>Review Photo</Text>
          <View style={cameraStyles.headerButton} />
        </View>

        <Image
          source={{ uri: photoData.uri }}
          contentFit="contain"
          style={cameraStyles.previewImage}
        />

        <View style={cameraStyles.previewActions}>
          <TouchableOpacity
            style={[cameraStyles.actionButton, cameraStyles.retakeButton]}
            onPress={() => setPhotoData(null)}
            disabled={isProcessing}
          >
            <MaterialCommunityIcons
              name="camera-retake"
              size={24}
              color="white"
            />
            <Text style={cameraStyles.actionButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[cameraStyles.actionButton, cameraStyles.processButton]}
            onPress={() => processImage(photoData)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <FontAwesome name="check" size={24} color="white" />
                <Text style={cameraStyles.actionButtonText}>Process</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  const renderCamera = () => {
    return (
      <View style={cameraStyles.container}>
        <Camera
          style={cameraStyles.camera}
          type={type}
          ref={cameraRef}
          ratio="16:9"
        >
          <SafeAreaView style={cameraStyles.cameraOverlay}>
            {/* Top Bar */}
            <View style={cameraStyles.topBar}>
              <TouchableOpacity
                style={cameraStyles.topButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>

              <View style={cameraStyles.cameraGuide}>
                <Text style={cameraStyles.guideText}>
                  Center groceries in frame
                </Text>
              </View>

              <TouchableOpacity
                style={cameraStyles.topButton}
                onPress={toggleCameraType}
              >
                <MaterialCommunityIcons
                  name="camera-flip-outline"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            {/* Focus Guide */}
            <View style={cameraStyles.focusArea}>
              <View style={[cameraStyles.focusCorner, { top: 0, left: 0 }]} />
              <View
                style={[
                  cameraStyles.focusCorner,
                  { top: 0, right: 0, transform: [{ rotate: "90deg" }] },
                ]}
              />
              <View
                style={[
                  cameraStyles.focusCorner,
                  { bottom: 0, left: 0, transform: [{ rotate: "-90deg" }] },
                ]}
              />
              <View
                style={[
                  cameraStyles.focusCorner,
                  { bottom: 0, right: 0, transform: [{ rotate: "180deg" }] },
                ]}
              />
            </View>

            {/* Bottom Controls */}
            <View style={cameraStyles.bottomControls}>
              <View style={cameraStyles.controlsRow}>
                <View style={{ width: 60 }} />

                <TouchableOpacity
                  style={cameraStyles.shutterButton}
                  onPress={takePicture}
                  activeOpacity={0.7}
                >
                  <View style={cameraStyles.shutterOuter}>
                    <View style={cameraStyles.shutterInner} />
                  </View>
                </TouchableOpacity>

                <View style={{ width: 60 }} />
              </View>
            </View>
          </SafeAreaView>
        </Camera>
      </View>
    );
  };

  return photoData ? renderPhotoPreview() : renderCamera();
};

export default CameraPage;
