// artizana-mobile/App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './src/screens/SignUp';
import NGOApplyScreen from './src/screens/NGOApplyScreen';
import NGOApplicationSuccessScreen from './src/screens/NGOApplicationSuccessScreen';
import Login from './src/screens/Login';
import HomeScreen from './src/screens/HomeScreen';

// KAN 6: add your role dashboards
import BuyerDashboard from './src/screens/BuyerDashboard';
import ArtisanDashboard from './src/screens/ArtisanDashboard';
import NgoDashboard from './src/screens/NgoDashboard';
import { LanguageProvider } from './src/context/LanguageContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: 'Sign Up' }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: 'Login' }}
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

          <Stack.Screen
            name="BuyerDashboard"
            component={BuyerDashboard}
            options={{ title: 'Buyer Dashboard' }}
          />
          <Stack.Screen
            name="ArtisanDashboard"
            component={ArtisanDashboard}
            options={{ title: 'Artisan Dashboard' }}
          />
          <Stack.Screen
            name="NgoDashboard"
            component={NgoDashboard}
            options={{ title: 'NGO Dashboard' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
