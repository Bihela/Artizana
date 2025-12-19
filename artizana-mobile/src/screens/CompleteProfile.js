import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    Image,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

// Handle Expo environment variables properly
const EXPO_API_URL = Constants?.expoConfig?.extra?.apiBaseUrl;
// Fallback to localhost if not found (mostly for simulator/dev)
const API_BASE_URL = EXPO_API_URL || 'http://localhost:5001/api';

export default function CompleteProfile({ navigation, route }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Buyer',
        bio: '',
        location: '',
        phoneNumber: '',
        shippingAddress: ''
    });
    const [profilePhoto, setProfilePhoto] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.replace('Login');
                return;
            }

            const res = await axios.get(`${API_BASE_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = res.data.user;

            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'Buyer',
                bio: user.bio || '',
                location: user.location || '',
                phoneNumber: user.phoneNumber || '',
                shippingAddress: user.shippingAddress || ''
            }));

            if (user.profilePhoto) {
                setProfilePhoto(user.profilePhoto);
            }
            setLoading(false);
        } catch (err) {
            console.log('Error fetching user:', err);
            setLoading(false);
            Alert.alert('Error', 'Failed to fetch user data. Please login again.');
            navigation.replace('Login');
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setProfilePhoto(result.assets[0].uri);
            }
        } catch (error) {
            console.log('Image picker error:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleSubmit = async () => {
        setSaving(true);

        // Validation
        if (formData.role === 'Artisan' && (!formData.bio || !formData.location)) {
            Alert.alert('Validation Error', 'Bio and Location are required for Artisans');
            setSaving(false);
            return;
        }
        if (formData.role === 'Buyer' && (!formData.phoneNumber || !formData.shippingAddress)) {
            Alert.alert('Validation Error', 'Phone Number and Shipping Address are required for Buyers');
            setSaving(false);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            if (formData.password) data.append('password', formData.password);
            data.append('role', formData.role);

            if (formData.role === 'Artisan') {
                data.append('bio', formData.bio);
                data.append('location', formData.location);
            } else if (formData.role === 'Buyer') {
                data.append('phoneNumber', formData.phoneNumber);
                data.append('shippingAddress', formData.shippingAddress);
            }

            if (profilePhoto && !profilePhoto.startsWith('http')) {
                let filename = profilePhoto.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

                // Fix for Android file path issues if necessary, but usually expo handles uri fine
                data.append('profilePhoto', { uri: profilePhoto, name: filename, type });
            }

            const res = await axios.put(`${API_BASE_URL}/auth/update-profile`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.token) {
                await AsyncStorage.setItem('token', res.data.token);
            }

            Alert.alert('Success', 'Profile Updated Successfully!');

            if (formData.role === 'Buyer') navigation.replace('BuyerDashboard');
            else if (formData.role === 'Artisan') navigation.replace('ArtisanDashboard');
            else navigation.replace('NgoDashboard');

        } catch (err) {
            console.log('Update error:', err);
            const msg = err.response?.data?.error || 'Failed to update profile. Please try again.';
            Alert.alert('Error', msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Complete Profile</Text>
            <Text style={styles.subtitle}>Finish setting up your {formData.role} account</Text>

            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
                    {profilePhoto ? (
                        <Image source={{ uri: profilePhoto }} style={styles.image} />
                    ) : (
                        <View style={styles.placeholderImage}><Text style={styles.placeholderText}>Add Photo</Text></View>
                    )}
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={formData.name} onChangeText={t => setFormData({ ...formData, name: t })} />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={formData.email} onChangeText={t => setFormData({ ...formData, email: t })} keyboardType="email-address" />

            <Text style={styles.label}>New Password (Optional)</Text>
            <TextInput style={styles.input} value={formData.password} onChangeText={t => setFormData({ ...formData, password: t })} secureTextEntry placeholder="Leave blank to keep current" />

            {formData.role === 'Artisan' && (
                <>
                    <Text style={styles.sectionHeader}>Artisan Details</Text>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput style={[styles.input, styles.textArea]} value={formData.bio} onChangeText={t => setFormData({ ...formData, bio: t })} multiline numberOfLines={4} placeholder="Tell us about yourself..." />

                    <Text style={styles.label}>Location</Text>
                    <TextInput style={styles.input} value={formData.location} onChangeText={t => setFormData({ ...formData, location: t })} placeholder="e.g. Kandy, Sri Lanka" />
                </>
            )}

            {formData.role === 'Buyer' && (
                <>
                    <Text style={styles.sectionHeader}>Buyer Details</Text>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput style={styles.input} value={formData.phoneNumber} onChangeText={t => setFormData({ ...formData, phoneNumber: t })} keyboardType="phone-pad" />

                    <Text style={styles.label}>Shipping Address</Text>
                    <TextInput style={[styles.input, styles.textArea]} value={formData.shippingAddress} onChangeText={t => setFormData({ ...formData, shippingAddress: t })} multiline numberOfLines={3} />
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Complete Profile</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { padding: 20, paddingBottom: 50, backgroundColor: '#f9fafb' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#111' },
    subtitle: { fontSize: 16, textAlign: 'center', color: '#6b7280', marginBottom: 20 },
    imageContainer: { alignItems: 'center', marginBottom: 20 },
    imageWrapper: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden', backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: '100%' },
    placeholderImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd' },
    placeholderText: { color: '#555', fontSize: 12 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#374151', marginTop: 10 },
    input: { backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', fontSize: 16 },
    textArea: { height: 80, textAlignVertical: 'top' },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 5, color: '#10b981' },
    button: { backgroundColor: '#10b981', padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
