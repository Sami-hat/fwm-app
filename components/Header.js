import { StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { useWindowDimensions } from "react-native";

export const Header = ({ onLogout, showMenu }) => {
  const dimensions = useWindowDimensions();

  return (
    <View style={headerStyle(dimensions.width, dimensions.height)}>
      <Text style={styles.text}>ShopTracker</Text>
    </View>
  );
};

const headerStyle = (windowWidth, windowHeight) => ({
  width: windowWidth,
  height: windowHeight * 0.10,
  backgroundColor: "#52B788",
  justifyContent: "center",
  alignItems: "center",
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    color: "white",
    fontSize: 24,
    marginTop: "8%",
  },
});
