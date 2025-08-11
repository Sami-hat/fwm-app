import { StyleSheet, Dimensions } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

export const cameraStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // Permission Screen Styles
  permissionContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionTitle: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#52B788",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    color: "#666",
    fontSize: 16,
  },

  // Camera View Styles
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  topButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 22,
  },
  cameraGuide: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  guideText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },

  // Focus Area
  focusArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  focusCorner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
    opacity: 0.7,
  },

  // Bottom Controls
  bottomControls: {
    paddingBottom: 30,
    paddingTop: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterButton: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  shutterOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "white",
  },

  // Preview Screen Styles
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  previewImage: {
    flex: 1,
    width: windowWidth,
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 30,
    paddingHorizontal: 40,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: "center",
  },
  retakeButton: {
    backgroundColor: "#666",
  },
  processButton: {
    backgroundColor: "#52B788",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Corner positioning for focus guides
  focusCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
    opacity: 0.7,
  },
});

// Add corner positions
const cornerSize = 100;
export const focusCornerPositions = {
  topLeft: {
    top: windowHeight * 0.3,
    left: windowWidth * 0.1,
  },
  topRight: {
    top: windowHeight * 0.3,
    right: windowWidth * 0.1,
    transform: [{ rotate: "90deg" }],
  },
  bottomLeft: {
    bottom: windowHeight * 0.3,
    left: windowWidth * 0.1,
    transform: [{ rotate: "-90deg" }],
  },
  bottomRight: {
    bottom: windowHeight * 0.3,
    right: windowWidth * 0.1,
    transform: [{ rotate: "180deg" }],
  },
};
