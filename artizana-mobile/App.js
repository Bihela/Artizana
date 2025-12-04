// artizana-mobile/App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './src/screens/SignUp';
import CompleteProfile from './src/screens/CompleteProfile';
import ProfileEdit from './src/screens/ProfileEdit';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfile} options={{ title: 'Complete Profile' }} />
        <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{ title: 'Edit Profile' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}