
// src/screens/SignUp.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAutoDiscovery } from 'expo-auth-session';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = Constants?.expoConfig?.extra?.apiBaseUrl || 'http://192.168.0.198:5001/api';

export default function SignUp() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Buyer');
  const roles = ['Buyer', 'Artisan'];

  // Use the app scheme from config (set in `app.json`) to produce a stable
  // native redirect URI for development builds. This avoids hardcoding any
  // Expo username and works when using a development build or standalone app.
  const scheme = Constants?.expoConfig?.scheme || 'artizana-dev';
  const redirectUriNative = makeRedirectUri({ scheme, path: 'callback' });
  const redirectUriLocal = makeRedirectUri({ preferLocalhost: true });
  console.log('Generated Redirect URI (native):', redirectUriNative);
  console.log('Generated Redirect URI (local):', redirectUriLocal);

  // Google OAuth setup. For development with a native dev build:
  // - Use the Web client ID (legacy approach during dev testing)
  // - Production builds should migrate to Android client with proper setup
  const {
    googleAndroidClientId,
    googleWebClientId,
  } = Constants?.expoConfig?.extra || {};

  console.log('Android Client ID loaded:', googleAndroidClientId);
  console.log('Web Client ID loaded:', googleWebClientId);

  // For now, prefer Web client ID for dev testing since custom URI schemes
  // are deprecated. In production, migrate to Android client ID.
  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };
  
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      // Android requires androidClientId; use the Web client ID as fallback
      androidClientId: googleAndroidClientId || googleWebClientId || '920666001666-8ec2tr76jpgthvgl710eqinlv3vui9c6.apps.googleusercontent.com',
      webClientId: googleWebClientId || '920666001666-8ec2tr76jpgthvgl710eqinlv3vui9c6.apps.googleusercontent.com',
      redirectUrl: redirectUriNative,
      scopes: ['profile', 'email'],
    },
    discovery
  );

  console.log('Auth request initialized:', !!request);
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleLogin(authentication.accessToken);
    } else if (response?.type === 'error') {
      console.error('Auth Error:', response.error);
      Alert.alert('Error', 'Authentication failed. Check redirect URI in Google Console.');
    }
  }, [response]);

  const handleGoogleLogin = async (accessToken) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/google-mobile`, { accessToken });
      const { token, name: backendName, email: backendEmail, role: backendRole } = res.data;

      setName(backendName);
      setEmail(backendEmail);
      if (backendRole) setRole(backendRole);

      Alert.alert('Success', 'Google login successful!');

      // Navigate: dashboards are a future ticket — send to ProfileEdit or CompleteProfile
      if (backendRole) {
        // Users with a role go to ProfileEdit for now
        navigation.replace('ProfileEdit', { token });
      } else {
        // New users complete role selection first
        navigation.replace('CompleteProfile', { token, name: backendName, email: backendEmail });
      }
    } catch (err) {
      console.error('Google Login Error:', err.response?.data || err.message);
      Alert.alert('Error', 'Google login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artizana</Text>
      <Text style={styles.subtitle}>Create your Account</Text>

      {/* For new users, these fields can be hidden or shown post-auth in CompleteProfile screen */}
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
        editable={false}  // Google email is verified
      />

      <Text style={styles.label}>Select Role:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(item) => setRole(item)}
        >
          {roles.map((r) => <Picker.Item key={r} label={r} value={r} />)}
        </Picker>
      </View>

      <Button
        title="Continue with Google"
        color="#4285F4"
        disabled={!request}
        onPress={() => promptAsync({ useProxy: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#757575', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, width: '100%' },
  label: { fontSize: 16, marginBottom: 5, alignSelf: 'flex-start' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 5, width: '100%' },
  picker: { height: 50 },
});
