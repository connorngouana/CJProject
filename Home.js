import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TextInput, Button } from 'react-native';

export default function HomeScreen({ route, navigation}) {
  const { token, userId } = route.params;

  const [posts, setPosts] = useState([]);
  const [newPostDescription, setNewPostDescription] = useState('');
  const [newPostPicturePath, setNewPostPicturePath] = useState('');

  useEffect(() => {
    fetchFeedPosts();
  }, []);

  const fetchFeedPosts = async () => {
    try {
      const response = await fetch('https://4180-84-203-11-66.ngrok-free.app/posts/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch feed posts:', error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(`https://4180-84-203-11-66.ngrok-free.app/posts/like/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      const updatedPost = await response.json();
      setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };



  const handleCreatePost = async () => {
    try {
      const response = await fetch('https://4180-84-203-11-66.ngrok-free.app/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email, // Include userId here
          description: newPostDescription,
        }),
      });
      
      const data = await response.json();
      setPosts(data); // Refresh posts after creating a new one
      console.log(data);
      setNewPostDescription('');
      setNewPostPicturePath('');
      fetchFeedPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };
  
  const renderPostItem = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.firstName} {item.lastName}</Text>
      <Image source={{ uri: item.picturePath }} style={styles.postImage} />
      <Text style={styles.postDescription}>{item.description}</Text>
      <Button title="Like" onPress={() => handleLikePost(item._id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.createPostContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter post description"
          value={newPostDescription}
          onChangeText={text => setNewPostDescription(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter picture URL (optional)"
          value={newPostPicturePath}
          onChangeText={text => setNewPostPicturePath(text)}
        />
        <Button title="Create Post" onPress={handleCreatePost} />
      </View>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
        style={styles.feed}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  createPostContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  postContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 5,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  postDescription: {
    fontSize: 16,
  },
  feed: {
    width: '80%',
  },
});
