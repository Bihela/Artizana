import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    HomeIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    AcademicCapIcon,
    UserCircleIcon
} from 'react-native-heroicons/outline';
import {
    HomeScreen,
    ProductsScreen,
    OrdersScreen,
    AnalyticsScreen,
    ProfileScreen
} from '../screens/Placeholders';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const [role, setRole] = useState('Buyer');

    useEffect(() => {
        const fetchRole = async () => {
            const savedRole = await AsyncStorage.getItem('role');
            if (savedRole) setRole(savedRole);
        };
        fetchRole();
    }, []);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e7eb',
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarActiveTintColor: '#16a34a', // green-600
                tabBarInactiveTintColor: '#6b7280', // gray-500
                tabBarLabelStyle: {
                    fontSize: 10,
                    marginBottom: 5,
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />
                }}
            />

            {/* Only visible to Artisan - KAN-91 */}
            {role === 'Artisan' && (
                <Tab.Screen
                    name="Sell"
                    component={ProductsScreen}
                    options={{
                        tabBarLabel: 'My Shop',
                        tabBarIcon: ({ color, size }) => <ShoppingBagIcon color={color} size={size} />
                    }}
                />
            )}

            <Tab.Screen
                name="Orders"
                component={OrdersScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <ClipboardDocumentListIcon color={color} size={size} />,
                    tabBarBadge: 3, // Badge support - KAN-91
                }}
            />

            <Tab.Screen
                name="Learn"
                component={AnalyticsScreen}
                options={{
                    tabBarLabel: 'Workshops',
                    tabBarIcon: ({ color, size }) => <AcademicCapIcon color={color} size={size} />
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <UserCircleIcon color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
