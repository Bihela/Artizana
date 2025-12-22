import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BuyerDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buyer Dashboard</Text>
      <Text style={styles.text}>Welcome Buyer 👋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#6B7280",
  },
});
