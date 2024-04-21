import * as React from "react"
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3001/getUser/id'); // Replace 'id' with the actual user ID
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
          <Text style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
          
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

});

export default ProfileScreen;
