import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    HomeIcon,
    Squares2X2Icon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
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
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false, // We are using our custom TopBar inside screens
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
            <Tab.Screen
                name="Products"
                component={ProductsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Squares2X2Icon color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Orders"
                component={OrdersScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <ClipboardDocumentListIcon color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Analytics"
                component={AnalyticsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <ChartBarIcon color={color} size={size} />
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
