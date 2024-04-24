import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [picture, setPicture] = useState([]);
  const navigation = useNavigation();


  const handleImage = async () => {
    let selected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(selected);
 
    if (!selected.canceled) {
      setPicture(selected.assets[0].uri);
    }
  };

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
          picturePath: picture,
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
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
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
      <Button
        mode="contained"
        onPress={handleImage}
        style={styles.imageButton}
      >
        Select Image
      </Button>
      <Button mode="contained" onPress={handleSignup}>
        Signup
      </Button>
      <Button onPress={() => navigation.navigate('Login')}>
        Go to Login
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
  imageButton: {
    marginTop: 10,
    backgroundColor: '#007AFF', // Change to your desired color
  },
});
