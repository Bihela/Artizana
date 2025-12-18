import React from 'react';
import { View, Text } from 'react-native';
import TopBar from '../components/TopBar';

const ScreenWrapper = ({ title }) => (
    // We include TopBar in the wrapper for now, or we can put it in the navigator header.
    // The user requested a "standard Bottom Navigation Bar + minimal TopBar".
    // Usually TopBar is persisted across screens or part of a layout.
    // In React Navigation, we can use 'header' option or just render it in the screen.
    // Rendering it in the screen gives more control over SafeArea.
    <View className="flex-1 bg-gray-50">
        <TopBar />
        <View className="flex-1 items-center justify-center p-4">
            <Text className="text-lg font-medium text-gray-800">{title}</Text>
        </View>
    </View>
);

export const HomeScreen = () => <ScreenWrapper title="Home Dashboard" />;
export const ProductsScreen = () => <ScreenWrapper title="Products" />;
export const OrdersScreen = () => <ScreenWrapper title="Orders" />;
export const AnalyticsScreen = () => <ScreenWrapper title="Analytics" />;
export const ProfileScreen = () => <ScreenWrapper title="Profile" />;
