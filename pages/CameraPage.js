//React + React-Native Imports
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

//Expo Imports
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import { Alert } from "react-native";

//Icon Imports
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

//Project imports
import { getIngredients } from "../backend/Api";

export const CameraPage = ({ ip, userId }) => {
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

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need permission to use your camera. Turn it on pretty please...
        </Text>
        <Button onPress={setPermission(true)} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  //  const setupCamera = () => {
  //    console.log("Camera Setup...");
  //  };

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    console.log(photo);
    setUri(photo?.uri);
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
            <Text style={styles.text}>Take another one?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              getIngredients(uri)
                .then((response) => response.json())
                .then((result) => {
                  const name =
                    result.segmentation_results[0].recognition_results[0].name;
                  Alert.alert(
                    "Image Processed",
                    `Name: ${name}`,
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                  );
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
              setUri(null);
            }}
            style={{
              width: windowWidth * 0.75,
              backgroundColor: "green",
              height: windowHeight * 0.06,
              margin: "2%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text type="subtitle" style={styles.text}>
              Process
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          //          onCameraReady={setupCamera}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.back_button}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.shutterContainer}>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Entypo name="circle" size={60} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
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
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
