import { useNavigation } from "@react-navigation/native";
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants?.expoConfig?.extra?.apiBaseUrl || 'http://localhost:5000/api';

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Buyer');
  const [error, setError] = useState('');

  const roles = ['Buyer', 'Artisan'];

  const handleSignUp = async () => {
    // ... your existing validation logic (unchanged)
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
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });

      Alert.alert('Success', 'Account created successfully!');
      // TODO: Navigate based on role later
      navigation.replace('Home'); // or Login / Profile
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Sign up failed.';
      setError(errMsg);
      Alert.alert('Error', errMsg);
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Coming Soon', 'Google Sign-In will be available soon!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Artizana</Text>
      <Text style={styles.subtitle}>Create your Account</Text>
      <Text style={styles.description}>Join Artizana to discover unique handmade crafts</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
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

      <Text style={styles.label}>Select Role</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          {roles.map((r) => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* CLICKABLE NGO LINK */}
      <TouchableOpacity
        onPress={() => navigation.navigate('NGOApply')} // Make sure this screen name exists
        style={styles.ngoLink}
      >
        <Text style={styles.ngoText}>Apply as an NGO/Edu Partner →</Text>
      </TouchableOpacity>

      {/* Link to Login screen for existing users */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>
          Already have an account?
          <Text style={styles.loginLinkBold}> Log in</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 60,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#111',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
    color: '#374151',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  signUpButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  or: {
    textAlign: 'center',
    color: '#9ca3af',
    marginVertical: 20,
    fontSize: 14,
  },
  ngoLink: {
    marginTop: 24,
    marginBottom: 12,
  },
  ngoText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginLink: {
    marginTop: 16,
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
  loginLinkBold: {
    color: '#22C55E',
    fontWeight: '600',
  },
});
