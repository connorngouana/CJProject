import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import SignupScreen from './Signup';
import LoginScreen from './Login';
import HomeScreen from './Home';
import MainContainer from "./navigation/MainContainer"
const Stack = createStackNavigator();



function App() {
  return (
    token ? <MainContainer/> : <LoginScreen/>
  );
}


export default App
