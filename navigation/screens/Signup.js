import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigation();
  const handleSignup = async () => {
    try {
      const response = await fetch('https://4180-84-203-11-66.ngrok-free.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log(data); // You can handle success accordingly
      if (response.ok) {
        navigation.navigate('Login');
      } else {
        console.error('Signup failed:', data.error);
      }
    } catch (error) {
      console.error('Signup failed:', error); // You can handle errors accordingly
    }
  };
  
  return (
    <View style={styles.container}>
      <Text>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Signup" onPress={handleSignup} />
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
  },
});
