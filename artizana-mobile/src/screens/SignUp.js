
// src/screens/SignUp.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

const API_BASE_URL = Constants?.expoConfig?.extra?.apiBaseUrl || 'http://192.168.0.198:5001/api';

export default function SignUp() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Buyer');
  const roles = ['Buyer', 'Artisan'];

  const {
    googleWebClientId,
  } = Constants?.expoConfig?.extra || {};

  // Use the Web Client ID from your Google Cloud Console "Web" credential.
  // This is required even for native Android apps to get the idToken/accessToken correctly.
  const webClientId = googleWebClientId || '920666001666-8ec2tr76jpgthvgl710eqinlv3vui9c6.apps.googleusercontent.com';

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // forceCodeForRefreshToken: true, // [Android] related to offlineAccess
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In Success:', userInfo);

      // The new library version returns a slightly different structure sometimes
      // Access token is usually in userInfo.data.tokens.accessToken or similar if scopes requested
      // But usually for verification we use idToken. 
      // Current backend uses `accessToken` to call Google UserInfo API.
      // We need to retrieve the tokens.

      const tokens = await GoogleSignin.getTokens();
      console.log('Google Tokens:', tokens);

      handleGoogleLogin(tokens.accessToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
        Alert.alert('Error', 'Google Play Services not available');
      } else {
        console.error('Some other error happened during Google Sign-In:', error);
        Alert.alert('Error', 'Google Sign-In failed');
      }
    }
  };

  const handleGoogleLogin = async (accessToken) => {
    try {
      console.log('Sending Access Token to Backend:', accessToken);
      const res = await axios.post(`${API_BASE_URL}/auth/google-mobile`, { accessToken });
      const { token, name: backendName, email: backendEmail, role: backendRole } = res.data;

      setName(backendName);
      setEmail(backendEmail);
      if (backendRole) setRole(backendRole);

      Alert.alert('Success', 'Google login successful!');

      if (backendRole) {
        navigation.replace('ProfileEdit', { token });
      } else {
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
        editable={false}
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
        onPress={signIn}
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
