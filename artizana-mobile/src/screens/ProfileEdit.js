import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileEdit() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Edit (placeholder)</Text>
      <Text style={styles.note}>This screen will be implemented in a separate ticket.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  note: { fontSize: 14, color: '#666', textAlign: 'center' }
});
