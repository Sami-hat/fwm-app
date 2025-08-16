import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        © {currentYear} Shelfie. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#52B788",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#52B788",
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#fffefeff",
    textAlign: "center",
  },
});

export default Footer;