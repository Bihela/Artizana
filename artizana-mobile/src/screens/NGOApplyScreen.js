// src/screens/NGOApplyScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import Constants from 'expo-constants'; // THIS IS THE KEY

// Now correctly reads your .env file via app.config.js
const API_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:5001/api';

export default function NGOApplyScreen({ navigation }) {
  const [form, setForm] = useState({
    organizationName: '',
    registrationNumber: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    mission: '',
  });

  const [logo, setLogo] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickFile = async (setter, allowedTypes = ['image/*', 'application/pdf']) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const file = res.assets[0];
      if (file.size > 5 * 1024 * 1024) {
        Alert.alert('File too large', 'Please select a file under 5MB');
        return;
      }
      setter(file);
    } catch (err) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (Object.values(form).some(v => !v.trim())) {
      return Alert.alert('Missing fields', 'Please fill all required fields');
    }
    if (!certificate || !proof) {
      return Alert.alert('Files required', 'Please upload certificate and proof');
    }
    if (form.mission.length < 50) {
      return Alert.alert('Mission too short', 'Minimum 50 characters required');
    }

    setLoading(true);
    const data = new FormData();

    // Text fields
    data.append('organizationName', form.organizationName);
    data.append('registrationNumber', form.registrationNumber);
    data.append('contactName', form.contactName);
    data.append('contactEmail', form.contactEmail);
    data.append('contactPhone', form.contactPhone);
    data.append('address', form.address);
    data.append('mission', form.mission);

    // Optional logo
    if (logo) {
      data.append('logo', {
        uri: logo.uri,
        name: logo.name || 'logo.jpg',
        type: logo.mimeType || 'image/jpeg',
      });
    }

    // Required files
    data.append('certificate', {
      uri: certificate.uri,
      name: certificate.name || 'certificate.pdf',
      type: certificate.mimeType || 'application/pdf',
    });

    data.append('proof', {
      uri: proof.uri,
      name: proof.name || 'proof.pdf',
      type: proof.mimeType || 'application/pdf',
    });

    try {
      await axios.post(`${API_URL}/ngo-applications/apply`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      Alert.alert('Success!', 'Application submitted successfully!');
      navigation.replace('NGOApplicationSuccess');
    } catch (err) {
      console.error('Upload error:', err.message);
      Alert.alert(
        'Upload Failed',
        err.response?.data?.error || err.message || 'Network error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Artizana</Text>

        {/* NGO Logo Upload */}
        <TouchableOpacity
          testID="logo-upload-button"
          style={styles.logoContainer}
          onPress={() => pickFile(setLogo, ['image/*'])}
        >
          {logo ? (
            <Image source={{ uri: logo.uri }} style={styles.logoImage} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>NGO</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.subtitle}>Apply as NGO Partner</Text>
        <Text style={styles.uploadHint}>Tap to upload logo (optional)</Text>
      </View>

      <View style={styles.form}>
        {/* All your fields */}
        <View style={styles.field}>
          <Text style={styles.label}>Organization Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Hope Foundation"
            value={form.organizationName}
            onChangeText={t => setForm({ ...form, organizationName: t })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Registration Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="NGO-DARPAN ID or Certificate No."
            value={form.registrationNumber}
            onChangeText={t => setForm({ ...form, registrationNumber: t })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contact Person Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={form.contactName}
            onChangeText={t => setForm({ ...form, contactName: t })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="contact@ngo.org"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.contactEmail}
            onChangeText={t => setForm({ ...form, contactEmail: t })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={styles.input}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            value={form.contactPhone}
            onChangeText={t => setForm({ ...form, contactPhone: t })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Organization Address *</Text>
          <TextInput
            style={[styles.input, { height: 90 }]}
            placeholder="Full address"
            multiline
            value={form.address}
            onChangeText={t => setForm({ ...form, address: t })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mission & Description (min 50 characters) *</Text>
          <TextInput
            style={[styles.input, { height: 140 }]}
            placeholder="Tell us about your mission..."
            multiline
            textAlignVertical="top"
            value={form.mission}
            onChangeText={t => setForm({ ...form, mission: t })}
          />
          <Text style={styles.counter}>{form.mission.length}/50</Text>
        </View>

        {/* Uploads */}
        <TouchableOpacity style={styles.uploadBox} onPress={() => pickFile(setCertificate)}>
          <Text style={styles.uploadText}>
            {certificate ? `Selected: ${certificate.name}` : 'Upload Registration Certificate *'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadBox} onPress={() => pickFile(setProof)}>
          <Text style={styles.uploadText}>
            {proof ? `Selected: ${proof.name}` : 'Upload Additional Proof (80G, 12A, etc.) *'}
          </Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { alignItems: 'center', paddingTop: 50, paddingBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#111' },
  logoContainer: { marginVertical: 20 },
  logoImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#e5e7eb' },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f3f4f6',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  logoText: { fontSize: 36, color: '#9ca3af', fontWeight: 'bold' },
  subtitle: { fontSize: 19, color: '#10b981', fontWeight: '600', marginTop: 10 },
  uploadHint: { color: '#6b7280', fontSize: 14, marginTop: 8 },
  form: { paddingHorizontal: 24, paddingBottom: 40 },
  field: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  counter: { textAlign: 'right', color: '#6b7280', fontSize: 13, marginTop: 4 },
  uploadBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#9ca3af',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 22,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: { color: '#4b5563', textAlign: 'center', fontSize: 15 },
  submitButton: {
    backgroundColor: '#10b981',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});