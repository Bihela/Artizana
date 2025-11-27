import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

// Dynamically load API base URL from Expo config
const API_BASE_URL = Constants?.expoConfig?.extra?.apiBaseUrl || 'http://localhost:5001/api';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [role, setRole] = useState('Buyer'); 
  const [error, setError] = useState('');

  const roles = ['Buyer', 'Artisan'];

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleLogin(authentication.accessToken);
    }
  }, [response]);

  const handleGoogleLogin = async (accessToken) => {
    try {
      // Send token to backend for validation & JWT creation
      const res = await axios.post(`${API_BASE_URL}/auth/google-mobile`, { accessToken });
      const { token, name: backendName, email: backendEmail, role: backendRole } = res.data;

      setName(backendName);
      setEmail(backendEmail);
      if (backendRole) setRole(backendRole);

      Alert.alert('Success', 'Google login successful! Complete your profile.');
      // Optionally navigate to CompleteProfile or dashboard if role exists
    } catch (err) {
      console.log('Google Login Error:', err.response?.data || err.message);
      Alert.alert('Error', 'Google login failed');
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || (!password && role !== 'Google') || !confirmPassword || !role) {
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
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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

      <Text style={styles.label}>Select Role:</Text>
      <View style={styles.pickerContainer}>
        <Picker
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

      <Button title="Sign Up" color="#4CAF50" onPress={handleSignUp} />
      <Text style={styles.or}>or</Text>
      <Button
        title="Continue with Google"
        color="#4285F4"
        disabled={!request}
        onPress={() => promptAsync()}
      />
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
  or: { marginVertical: 10, color: '#757575' },
  ngo: { color: '#4CAF50', marginTop: 10 },
});