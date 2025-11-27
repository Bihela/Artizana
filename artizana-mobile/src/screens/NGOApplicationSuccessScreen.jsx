// src/screens/NGOApplicationSuccessScreen.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import trophy from '../../assets/trophy.png';

export default function NGOApplicationSuccessScreen({ navigation }) {
  return (
    <View className="flex-1 bg-gray-50 justify-center items-center px-6">
      <View className="bg-white rounded-3xl shadow-2xl p-10 items-center max-w-md w-full">
        <Image source={trophy} className="w-32 h-32 mb-6" resizeMode="contain" />
        <Text className="text-2xl font-bold text-center mb-3">Registration Submitted</Text>
        <Text className="text-gray-600 text-center mb-8">
          Thank you for registering with Artizana.
          {'\n'}
          Your application is now pending approval from our admin team.
        </Text>

        <View className="bg-green-50 rounded-2xl p-6 w-full mb-8">
          <Text className="font-bold text-center mb-4">What's Next?</Text>
          <View className="space-y-4">
            <View className="flex-row">
              <Text className="text-4xl mr-4">Verification</Text>
              <View>
                <Text className="font-semibold">Admin Verification</Text>
                <Text className="text-gray-600 text-sm">Usually takes 2–3 business days</Text>
              </View>
            </View>
            <View className="flex-row">
              <Text className="text-4xl mr-4">Email</Text>
              <View>
                <Text className="font-semibold">Email Notification</Text>
                <Text className="text-gray-600 text-sm">You will receive login details once approved</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.replace('Home')} // or 'SignIn'
          className="bg-green-600 px-12 py-4 rounded-full"
        >
          <Text className="text-white font-bold text-lg">Back to Homepage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}