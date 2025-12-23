// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    navigation.replace('Login');
                    return;
                }

                // Unified API URL logic matching Login.js
                const API_BASE_URL =
                    Constants?.expoConfig?.extra?.apiBaseUrl ||
                    process.env.EXPO_PUBLIC_API_BASE_URL ||
                    process.env.REACT_APP_API_BASE_URL ||
                    "http://localhost:5001/api";

                const response = await axios.get(`${API_BASE_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.user);
            } catch (err) {
                console.error('Failed to fetch profile', err);
                setError('Failed to load profile');
                if (err.response && err.response.status === 401) {
                    navigation.replace('Login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigation]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!user) return null;

    return (
        <View style={styles.mainContainer}>
            {/* Status Bar / Safe Area overlap could be handled here or via SafeAreaView in parent */}
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            {user.profilePhoto ? (
                                <Image source={{ uri: user.profilePhoto }} style={styles.photo} />
                            ) : (
                                <View style={styles.photoPlaceholder}>
                                    <Text style={styles.photoPlaceholderText}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.editIconBadge}>
                                <Text style={styles.editIcon}>✎</Text>
                            </View>
                        </View>

                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{user.role}</Text>
                        </View>

                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Wishlist</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                </View>

                {/* Activity Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <TouchableOpacity><Text style={styles.seeAllText}>View All</Text></TouchableOpacity>
                    </View>

                    <View style={styles.placeholderBox}>
                        <View style={styles.placeholderIconCircle}>
                            <Text style={styles.placeholderIcon}>🕒</Text>
                        </View>
                        <Text style={styles.placeholderTitle}>No recent activity</Text>
                        <Text style={styles.placeholderText}>Your interactions will appear here.</Text>
                        <TouchableOpacity style={styles.browseButton}>
                            <Text style={styles.browseButtonText}>Start Exploring</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={() => {
                    AsyncStorage.removeItem('token');
                    navigation.replace('Login');
                }}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Gray-100 matches web bg
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    header: {
        backgroundColor: '#10B981', // Emerald-500
        paddingTop: 40,
        paddingBottom: 80, // Space for the card to overlap
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    profileCard: {
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        width: '90%',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: -60, // Pull up stats row
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#D1FAE5', // Emerald-100
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    photoPlaceholderText: {
        fontSize: 40,
        color: '#059669', // Emerald-600
        fontWeight: 'bold',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#10B981',
        borderRadius: 999,
        padding: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    editIcon: {
        color: 'white',
        fontSize: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    roleBadge: {
        backgroundColor: '#ECFDF5', // Emerald-50
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 999,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    roleText: {
        color: '#059669', // Emerald-600
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    editButton: {
        width: '100%',
        backgroundColor: '#1F2937', // Gray-900
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 80, // Space specifically for the overlap
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E5E7EB',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        fontWeight: '500',
    },
    section: {
        padding: 20,
        marginTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    seeAllText: {
        color: '#059669',
        fontWeight: '600',
    },
    placeholderBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    placeholderIconCircle: {
        width: 60,
        height: 60,
        backgroundColor: '#F3F4F6',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    placeholderIcon: {
        fontSize: 24,
    },
    placeholderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    placeholderText: {
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    browseButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#10B981',
        borderRadius: 10,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    browseButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    logoutButton: {
        marginHorizontal: 20,
        marginBottom: 40,
        paddingVertical: 16,
        alignItems: 'center',
    },
    logoutText: {
        color: '#EF4444', // Red-500
        fontWeight: '600',
        fontSize: 16,
    },
    // Loading/Error states reused
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
    },
});

export default ProfileScreen;
