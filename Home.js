import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { Card, Avatar, Button, IconButton } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker";


const HomeScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [commentText, setCommentText] = useState('');
const [picture, setPicture] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [friendStatus, setFriendStatus] = useState({});
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
          userPicturePath: picture,
          picturePath: picture,
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
            isLiked: !post.isLiked, // Toggle the like status
            likes: updatedPost.likes, // Update the likes count
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText) {
      alert('Please enter a comment.');
      return;
    }
    try {
      const response = await fetch(`https://4180-84-203-11-66.ngrok-free.app/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          text: commentText,
        }),
      });
      const updatedPost = await response.json();
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: updatedPost.comments, // Update the comments array
          };
        }
        return post;
      });
      setPosts(updatedPosts);
      setCommentText(''); // Clear the comment input after submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddRemoveFriend = async (friendId) => {
    try {
      const response = await fetch(`https://4180-84-203-11-66.ngrok-free.app/users/${userId}/${friendId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const formattedFriends = await response.json();
      console.log('Formatted Friends:', formattedFriends);
      
      // Update the friend status based on the response
      setFriendStatus({ ...friendStatus, [friendId]: !friendStatus[friendId] });
    } catch (error) {
      console.error('Error adding/removing friend:', error);
    }
  };

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
        <Button
        mode="contained"
        onPress={handleImage}
        style={styles.imageButton}
      >
        Select Image
      </Button>
        <Button mode="contained" onPress={handlePost} style={styles.postButton}>
          Post
        </Button>
      </View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <Card style={styles.postContainer}>
              <Card.Title
                title={`${item.firstName} ${item.lastName}`}
                subtitle={`Posted by ${item.firstName} ${item.lastName}`}
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={{ uri: item.userPicturePath || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' }}
                  />
                )}
              />
              <Card.Content>
                <Text style={styles.postText}>{item.description}</Text>
                <Image
                  style={styles.postImage}
                  source={{ uri: item.picturePath || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' }}
                />
              </Card.Content>
              <TextInput
                  placeholder="Add a comment..."
                  style={styles.commentInput}
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <Card.Actions style={styles.interactionContainer}>
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
    <TouchableOpacity onPress={() => handleLike(item._id)}>
      <IconButton
        icon={item.isLiked ? "heart" : "heart-outline"}
        color={item.isLiked ? "#ff0000" : "#007bff"}
        size={24}
      />
    </TouchableOpacity>
    <Text style={styles.likesCount}>{item.likes.length}</Text>
  </View>
  <TouchableOpacity onPress={() => handleComment(item._id)}>
    <Button mode="outlined" style={styles.commentButton}>
      Comment
    </Button>
  </TouchableOpacity>
</Card.Actions>
              <Card.Content style={styles.commentsContainer}>
                {item.comments.length > 0 && (
                  <>
                    <Text style={styles.commentsHeader}>Comments:</Text>
                    {item.comments.map((comment, index) => (
                      <View key={index} style={styles.comment}>
                        <Text style={styles.commentText}>
                          <Text style={styles.commentUserName}>
                            {item.firstName} {item.lastName}: 
                          </Text>{" "}
                          {comment.text}
                        </Text>
                      </View>
                    ))}
                  </>
                )}
              </Card.Content>
              <IconButton
                icon={friendStatus[item.userId] ? "account-minus-outline" : "account-plus-outline"}
                color="#007bff"
                size={24}
                onPress={() => handleAddRemoveFriend(item.userId)}
                style={styles.addRemoveButton}
              />
            </Card>
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
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',

  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  textInput: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  postButton: {
    marginBottom: 10,
  },
  postContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  postText: {
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  likesCount: {
    marginLeft: 5,
    marginRight: 10,
    fontSize: 14,
    color: '#666666',
  },
  commentButton: {
    marginRight: 10,
    borderColor: '#007bff',
    justifyContent: 'space-between',
  },
  commentsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
  },
  commentsHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  comment: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
  },
  commentUserName: {
    fontWeight: 'bold',
  },
  commentInput: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  addRemoveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default HomeScreen;
