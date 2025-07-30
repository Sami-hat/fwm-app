import { cameraStyles } from '../styles/CameraPageStyles';

import { useState, useRef } from "react";
import { Button, cameraStylesheet, Text, TouchableOpacity, View } from "react-native";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";

import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { recipeService } from "../services/apiService";

export const CameraPage = ({ userId }) => {
  const navigation = useNavigation();
  const [facing, setFacing] = useState("back");
  const [permission, setPermission] = useCameraPermissions();
  const [uri, setUri] = useState(null);
  const cameraRef = useRef(null);

  const randomWidth = useSharedValue(10);
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };
  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });

  const getIngredients = async (imageUri) => {
    try {
      const result = await recipeService.analyzeImage(imageUri);

      if (result.segmentation_results &&
        result.segmentation_results[0] &&
        result.segmentation_results[0].recognition_results &&
        result.segmentation_results[0].recognition_results[0]) {

        const name = result.segmentation_results[0].recognition_results[0].name;
        Alert.alert(
          "Image Processed",
          `Detected: ${name}`,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      } else {
        Alert.alert("Error", "Could not identify any food items in the image");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process image. Please try again.");
    } finally {
      setUri(null);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={cameraStyles.container}>
        <Text style={cameraStyles.message}>
          We need permission to use your camera
        </Text>
        <Button onPress={() => setPermission(true)} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync();
      console.log(photo);
      setUri(photo?.uri);
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture");
    }
  };

  const renderPicture = () => {
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    return (
      <View style={{ backgroundColor: "black" }}>
        <Image
          source={{ uri }}
          contentFit="contain"
          contentPosition="center"
          style={{ width: 400, aspectRatio: 0.7, marginTop: 64 }}
        />
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setUri(null)}
            style={{
              width: windowWidth * 0.75,
              backgroundColor: "blue",
              height: windowHeight * 0.06,
              margin: "2%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={cameraStyles.text}>Take another one?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => getIngredients(uri)}
            style={{
              width: windowWidth * 0.75,
              backgroundColor: "green",
              height: windowHeight * 0.06,
              margin: "2%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text type="subtitle" style={cameraStyles.text}>
              Process
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={cameraStyles.container}>
        <CameraView
          style={cameraStyles.camera}
          facing={facing}
          ref={cameraRef}
        >
          <View style={cameraStyles.buttonContainer}>
            <TouchableOpacity
              style={cameraStyles.back_button}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={cameraStyles.shutterContainer}>
              <TouchableOpacity style={cameraStyles.button} onPress={takePicture}>
                <Entypo name="circle" size={60} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={cameraStyles.button}
              onPress={toggleCameraFacing}
            >
              <MaterialCommunityIcons
                name="camera-flip-outline"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  };

  return (
    <View style={cameraStyles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
};

export default CameraPage;