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
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL =
  Constants?.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'http://localhost:5001/api';

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

      // Save token and role to storage so CompleteProfile can use 'me'
      const { token, user } = response.data;
      if (token) {
        // Import AsyncStorage if not already imported, or verify imports
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem('token', token);
        if (user && user.role) {
          await AsyncStorage.setItem('role', user.role);
        }
      }

      Alert.alert('Success', 'Account created successfully!');

      // Navigate to CompleteProfile regardless of role initially
      navigation.replace('CompleteProfile');
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
      <View style={styles.roleContainer}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r}
            style={[
              styles.roleButton,
              role === r && styles.selectedRoleButton,
            ]}
            onPress={() => setRole(r)}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === r && styles.selectedRoleButtonText,
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
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
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectedRoleButton: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedRoleButtonText: {
    color: '#10b981',
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
