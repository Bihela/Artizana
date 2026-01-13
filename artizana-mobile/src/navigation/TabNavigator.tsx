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
    ProductsScreen,
    OrdersScreen,
    AnalyticsScreen
} from '../screens/Placeholders';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DemoScreen from '../screens/DemoScreen';

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
        // @ts-ignore
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
            }
            }
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <HomeIcon color={color} size={size} />
                }}
            />

            {/* Only visible to Artisan - KAN-91 */}
            {
                role === 'Artisan' && (
                    <Tab.Screen
                        name="Sell"
                        component={ProductsScreen}
                        options={{
                            tabBarLabel: 'My Shop',
                            tabBarIcon: ({ color, size }: { color: string; size: number }) => <ShoppingBagIcon color={color} size={size} />
                        }}
                    />
                )
            }

            <Tab.Screen
                name="Orders"
                component={OrdersScreen}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <ClipboardDocumentListIcon color={color} size={size} />,
                    tabBarBadge: 3, // Badge support - KAN-91
                }}
            />

            <Tab.Screen
                name="Learn"
                component={AnalyticsScreen}
                options={{
                    tabBarLabel: 'Workshops',
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <AcademicCapIcon color={color} size={size} />
                }}
            />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <UserCircleIcon color={color} size={size} />
                }}
            />

            {/* Mobile Feature Testing Tab - KAN-Requested */}
            <Tab.Screen
                name="Demo"
                component={DemoScreen}
                options={{
                    tabBarLabel: 'Test',
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <ClipboardDocumentListIcon color={color} size={size} /> // Using existing icon for now
                }}
            />
        </Tab.Navigator >
    );
};

export default TabNavigator;
