import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://4180-84-203-11-66.ngrok-free.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data); // You can handle success accordingly
      navigation.navigate('Home', { token: data.token, userId: data.user._id, firstName: data.user.firstName , lastName: data.user.lastName }); // Pass userId along with token
    } catch (error) {
      console.error('Login failed:', error.message); // Log the error message
      if (error instanceof SyntaxError) {
        console.error('Invalid JSON format in response:', await response.text());
      }
      // Handle other errors accordingly
    }
  }    
  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        label="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate('Signup')}>
        Go to Signup
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
});
