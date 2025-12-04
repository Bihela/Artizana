import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Constants?.expoConfig?.extra?.apiBaseUrl || 'http://localhost:5000/api';

export default function CompleteProfile({ route, navigation }) {
  const { token: routeToken, name, email } = route.params || {};
  const [role, setRole] = useState('Buyer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Store the token if passed from OAuth flow
    if (routeToken) {
      AsyncStorage.setItem('token', routeToken).catch(() => {});
    }
  }, [routeToken]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = (await AsyncStorage.getItem('token')) || routeToken;
      if (!token) return Alert.alert('Error', 'No authentication token found');

      const res = await axios.post(
        `${API_BASE_URL}/auth/complete-profile`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.token) {
        await AsyncStorage.setItem('token', res.data.token);
      }

      // Redirect to profile edit for now (dashboard screens are a future ticket)
      navigation.replace('ProfileEdit');
    } catch (err) {
      console.error('Complete profile error:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete your profile</Text>
      <Text style={styles.subtitle}>{name || ''} {email ? `(${email})` : ''}</Text>

      <Text style={styles.label}>Select Role</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={role} onValueChange={(v) => setRole(v)}>
          <Picker.Item label="Buyer" value="Buyer" />
          <Picker.Item label="Artisan" value="Artisan" />
        </Picker>
      </View>

      <Button title={loading ? 'Saving...' : 'Continue'} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 16 },
});
