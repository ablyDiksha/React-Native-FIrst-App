
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../features/home/presentation/screens/HomeScreen';
import SignInScreen from '../features/login/signInScreen';

import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signin">
        <Stack.Screen
          name="Signin"
          component={SignInScreen}
          options={{title: 'Sign In'}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
};

export default AppNavigator;
