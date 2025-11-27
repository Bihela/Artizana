// artizana-mobile/App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './src/screens/SignUp';
import NGOApplyScreen from './src/screens/NGOApplyScreen';
import NGOApplicationSuccessScreen from './src/screens/NGOApplicationSuccessScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ title: 'Sign Up' }} 
        />
        <Stack.Screen 
          name="NGOApply" 
          component={NGOApplyScreen}
          options={{ title: 'Apply as NGO' }}
        />
        <Stack.Screen
          name="NGOApplicationSuccess"
          component={NGOApplicationSuccessScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}