import * as React from "react"
import { useState } from "react"
import { Text, View, Button } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // Import Material Icons
import { Platform } from "react-native";

export default function FriendsScreen() {
    const [friends, setFriends] = useState([]);
  
    const addRemoveFriend = async () => {
      try {
        const response = await fetch('http://localhost:3001/addRemoveFriend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: 'user_id',
            friendId: 'friend_id',
          }),
        });
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4}}>
        
        <View>
          {friends.map((friend) => (
            <Text key={friend._id}>{`${friend.firstName} ${friend.lastName}`}</Text>
          ))}
          <Button title="Add/Remove Friend" onPress={addRemoveFriend} />
        </View>
        <View>
            <Text>All friends</Text>
        </View>
        
      </View>
    );
  }
  