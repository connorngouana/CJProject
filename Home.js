import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, Button, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const HomeScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { token, userId, firstName, lastName } = route.params;

  // Function to fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://4180-84-203-11-66.ngrok-free.app/posts/',{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle post submission
  const handlePost = async () => {
    if (!description) {
      alert('Please enter a description for your post.');
      return;
    }
    try {
      const response = await fetch('https://4180-84-203-11-66.ngrok-free.app/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, description }),
      });
      const result = await response.json();
      console.log(result);
      setDescription('');
      fetchPosts();
    } catch (error) {
      console.error('Failed to submit post:', error);
    }
  };

  // Function to add or remove friend
  const addRemoveFriend = async (friendId) => {
    try {
      const response = await fetch(`https://4180-84-203-11-66.ngrok-free.app/users/${userId}/${friendId}`, {
        method: 'PATCH', // Using PATCH method to add or remove friend
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data); // Handle response as needed
      // Update UI or state based on the response
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Initial fetch of posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="What's on your mind?"
          style={styles.textInput}
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Post" onPress={handlePost} />
      </View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <View style={styles.userInfo}>
                <Image style={styles.userAvatar} source={{ uri: item.userPicturePath }} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.userName}>{`${firstName} ${lastName}`}</Text>
                  <Text style={styles.postedBy}>Posted by {`${firstName} ${lastName}`}</Text>
                </View>
              </View>
              <Text style={styles.postText}>{item.description}</Text>
              <Image style={styles.postImage} source={{ uri: item.picturePath }} />
              {/* Friend Add/Remove Button */}
              <TouchableOpacity onPress={() => addRemoveFriend(item.userId)} style={styles.addRemoveButton}>
                <Ionicons name="person-add-outline" size={24} color="#007bff" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  inputContainer: {
    padding: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  postContainer: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postedBy: {
    color: '#999',
  },
  postText: {
    marginVertical: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  addRemoveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default HomeScreen;
