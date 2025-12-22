import React from "react";
import { View, Text, StyleSheet } from "react-native";
<<<<<<< HEAD
import LanguageSelectorModal from "../components/LanguageSelectorModal";
import { useLanguage } from "../context/LanguageContext";

export default function BuyerDashboard() {
  const { language, selectLanguage, isLoading } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buyer Home</Text>
      <Text style={styles.text}>Coming Soon</Text>
      <Text style={styles.text}>Current Language: {language || 'None'}</Text>

      <LanguageSelectorModal
        visible={!isLoading && !language}
        onSelectLanguage={selectLanguage}
      />
=======

export default function BuyerDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buyer Dashboard</Text>
      <Text style={styles.text}>Welcome Buyer 👋</Text>
>>>>>>> dev
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
