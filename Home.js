import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, Button, TouchableOpacity } from 'react-native';

const HomeScreen = ({route}) => {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { token, userId } = route.params;

  // Function to fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://4180-84-203-11-66.ngrok-free.app/posts/',{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }); // Your API endpoint to get posts
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
      const response = await fetch('https://4180-84-203-11-66.ngrok-free.app/posts', { // Your API endpoint to create a post
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, description }),
      });
      const result = await response.json();
      console.log(result);
      setDescription(''); // Clear the input after submission
      fetchPosts(); // Reload posts after adding
    } catch (error) {
      console.error('Failed to submit post:', error);
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
              <Image style={styles.userAvatar} source={{ uri: item.userPicturePath }} />
              <Text style={styles.postText}>{item.description}</Text>
              <Image style={styles.postImage} source={{ uri: item.picturePath }} />
              {/* You might want to add buttons for liking, commenting, etc. */}
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
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  postText: {
    marginVertical: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
});

export default HomeScreen;
