// src/screens/NGOApplicationSuccessScreen.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Use actual icons (recommended: from assets or expo-vector-icons)
import { Ionicons } from '@expo/vector-icons';
import hourglassIcon from '../../assets/icons/hourglass.png';

export default function NGOApplicationSuccessScreen() {
  const navigation = useNavigation();

  const handleBackToSignUp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignUp' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Top Hourglass Icon */}
        <Image source={hourglassIcon} style={styles.topIcon} resizeMode="contain" />

        <Text style={styles.title}>Registration Submitted</Text>
        <Text style={styles.subtitle}>
          Thank you for registering with Artizana.
          {'\n'}
          Your application is now pending approval from our admin team.
        </Text>

        {/* What's Next Box */}
        <View style={styles.nextBox}>
          <Text style={styles.nextTitle}>What's Next?</Text>

          {/* Step 1: Admin Verification */}
          <View style={styles.stepRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark-outline" size={28} color="#166534" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>Admin Verification</Text>
              <Text style={styles.stepDetail}>
                Our team will review your submitted details for verification.
                {'\n'}
                This process usually takes 2–3 business days.
              </Text>
            </View>
          </View>

          {/* Step 2: Email Notification */}
          <View style={styles.stepRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={28} color="#166534" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>Email Notification</Text>
              <Text style={styles.stepDetail}>
                Once approved, you’ll receive an email with a link to access
                {'\n'}your NGO dashboard and get started.
              </Text>
            </View>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleBackToSignUp}>
          <Text style={styles.buttonText}>Back to Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 32,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 15,
  },
  topIcon: {
    width: 90,
    height: 90,
    marginBottom: 24,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  nextBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginBottom: 32,
  },
  nextTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#166534',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
  },
  stepHeading: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  stepDetail: {
    fontSize: 14.5,
    color: '#4b5563',
    lineHeight: 21,
  },
  button: {
    backgroundColor: '#10b981',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 220,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});