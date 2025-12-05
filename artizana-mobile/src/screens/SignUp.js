import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Constants from 'expo-constants';

// Dynamically load API base URL from Expo config
const API_BASE_URL = Constants?.expoConfig?.extra?.apiBaseUrl || 'http://localhost:5000/api';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Buyer'); // Default to Buyer 
  const [error, setError] = useState('');

  const roles = ['Buyer', 'Artisan'];

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword || !role) {
      setError('All fields are required.');
      Alert.alert('Error', 'All fields are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format.');
      Alert.alert('Error', 'Invalid email format.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        { name, email, password, role },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );
      Alert.alert('Success', 'Account created! Role-based access applied.');
      console.log('Response:', response.data);
      // TODO: Save token to AsyncStorage, navigate to profile edit page based on role
    } catch (err) {
      console.log('Signup Error Details:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Sign-up failed.';
      setError(errMsg);
      Alert.alert('Error', errMsg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artizana</Text>
      <Text style={styles.subtitle}>Create your Account</Text>
      <Text style={styles.description}>Join the Artizana community</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Select Role:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          testID="picker"
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          {roles.map((r) => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Only the main Sign Up button remains */}
      <Button title="Sign Up" color="#4CAF50" onPress={handleSignUp} />

      <Text style={styles.ngo}>Apply as an NGO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#757575', marginBottom: 5 },
  description: { fontSize: 14, color: '#757575', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, width: '100%' },
  label: { fontSize: 16, marginBottom: 5, alignSelf: 'flex-start' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 5, width: '100%' },
  picker: { height: 50 },
  error: { color: 'red', marginBottom: 10 },
  ngo: { color: '#4CAF50', marginTop: 20 },
});