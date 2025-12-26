import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../components/TopBar';

const ScreenWrapper = ({ title }) => (
    <View className="flex-1 bg-gray-50">
        <TopBar />
        <View className="flex-1 items-center justify-center p-4">
            <Text className="text-lg font-medium text-gray-800">{title}</Text>
        </View>
    </View>
);

export const HomeScreen = () => {
    const [role, setRole] = useState('Buyer');

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const savedRole = await AsyncStorage.getItem('role');
                if (savedRole) {
                    setRole(savedRole);
                }
            } catch (error) {
                console.error('Error fetching role:', error);
            }
        };
        fetchRole();
    }, []);

    const dashboardTitle = role === 'NGO/Edu Partner' ? 'NGO Dashboard' : `${role} Dashboard`;

    return <ScreenWrapper title={dashboardTitle} />;
};

export const ProductsScreen = () => {
    const navigation = useNavigation();
    return (
        <View className="flex-1 bg-gray-50">
            <TopBar />
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-lg font-medium text-gray-800 mb-4">Products</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddProduct')}
                    className="bg-green-600 px-6 py-3 rounded-full"
                >
                    <Text className="text-white font-bold">Add New Product</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export const OrdersScreen = () => <ScreenWrapper title="Orders" />;
export const AnalyticsScreen = () => <ScreenWrapper title="Analytics" />;
export const ProfileScreen = () => <ScreenWrapper title="Profile" />;
