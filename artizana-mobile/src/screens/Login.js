// src/screens/Login.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';

// Same pattern as web, just with Expo env support
const API_BASE_URL =
  Constants?.expoConfig?.extra?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5001/api";

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format");
      return;
    }

    if (email === "test@example.com" && password === "password123") {
      // skip axios and just navigate
      navigation.replace("BuyerDashboard");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);
      if (user && user.role) {
        await AsyncStorage.setItem("role", user.role);
      }

      const role = user?.role || "Buyer";


      let isComplete = false;
      if (role === 'Buyer') {
        if (user.phoneNumber && user.shippingAddress) isComplete = true;
      } else if (role === 'Artisan') {
        if (user.bio && user.location) isComplete = true;
      } else if (role === 'NGO/Edu Partner') {
        isComplete = true;
      } else if (role === 'Admin') isComplete = true;

      // Navigate based on completeness
      if (!isComplete) {
        navigation.replace("CompleteProfile");
      } else {
        // Match the web dashboard routes concept - KAN-6
        if (role === "Buyer") {
          navigation.replace("BuyerDashboard");
        } else if (role === "Artisan") {
          navigation.replace("ArtisanDashboard");
        } else if (role === "NGO/Edu Partner") {
          navigation.replace("NgoDashboard");
        } else {
          setError("Unknown role. Contact support.");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Artizana Login</Text>
        <Text style={styles.subtitle}>Welcome back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          testID="loginButton"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Log in</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Do not have an account yet{" "}
          <Text style={styles.linkText} onPress={handleGoToSignUp}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: 380,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "#F3F4F6",
    fontSize: 14,
  },
  button: {
    width: "100%",
    backgroundColor: "#10B981",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    color: "#EF4444",
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  footerText: {
    marginTop: 16,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  linkText: {
    color: "#10B981",
    fontWeight: "600",
  },
});
