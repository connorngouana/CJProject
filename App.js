import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import SignupScreen from './Signup';
import LoginScreen from './Login';
import HomeScreen from './Home';

const Stack = createStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen 
          name="Login" 
          children={(props) => <LoginScreen {...props}  />} 
        />
        <Stack.Screen 
          name="Home" 
          children={(props) => <HomeScreen {...props} />} 
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
