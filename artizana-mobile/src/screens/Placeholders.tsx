import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from '../components/TopBar';


const ScreenWrapper = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <View className="flex-1 bg-gray-50">
        <TopBar />
        <View className="flex-1 items-center justify-center p-4">
            <Text className="text-lg font-medium text-gray-800 mb-4">{title}</Text>
            {children}
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
    const navigation = useNavigation<any>();
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

export const OrdersScreen = () => {
    const sampleImages = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <TopBar />
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="p-4 items-center">
                    <Text className="text-xl font-bold mb-2">Orders</Text>
                    <Text className="text-gray-500">Your orders will appear here.</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export const AnalyticsScreen = () => <ScreenWrapper title="Analytics" />;
export const ProfileScreen = () => <ScreenWrapper title="Profile" />;
