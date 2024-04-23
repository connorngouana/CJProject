import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, Button, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { token, userId } = route.params;

  const fetchPosts = async () => {
    setLoading(true);
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
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

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
        body: JSON.stringify({
          userId,
          description,
          userPicturePath: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
          picturePath: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        }),
      });
      const result = await response.json();
      console.log(result);
      setDescription('');
      fetchPosts();
    } catch (error) {
      console.error('Failed to submit post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`https://4180-84-203-11-66.ngrok-free.app/posts/${postId}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      const updatedPost = await response.json();
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked // Toggle the like status
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
                  <Text style={styles.userName}>{`${item.firstName} ${item.lastName}`}</Text>
                  <Text style={styles.postedBy}>Posted by {`${item.firstName} ${item.lastName}`}</Text>
                </View>
              </View>
              <Text style={styles.postText}>{item.description}</Text>
              <Image style={styles.postImage} source={{ uri: item.picturePath }} />
              <View style={styles.interactionContainer}>
              <TouchableOpacity onPress={() => handleLike(item._id)} style={styles.likeButton}>
              <View style={styles.likeContainer}>
                {item.isLiked ? (
                  <Ionicons name="heart" size={24} color="#ff0000" />
                ) : (
                  <Ionicons name="heart-outline" size={24} color="#007bff" />
                )}
                <Text style={styles.likesCount}>{item.likes.length}</Text>
              </View>
            </TouchableOpacity>
                <Text style={styles.likesCount}>{item.likes.length}</Text>
              </View>
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
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeButton: {
    marginRight: 10,
  },
  likesCount: {
    fontWeight: 'bold',
  },
  addRemoveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default HomeScreen;
