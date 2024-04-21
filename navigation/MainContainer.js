import * as React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // Import Material Icons

//Screens
import HomeScreen from "./screens/HomeScreen";
import FeedScreen from "./screens/FeedScreen";
import ProfileScreen from "./screens/ProfileScreen";
import FriendsScreen from "./screens/FriendsScreen";

//Screen names
const homeName = "Home";
const feedName = "Feed";
const profileName = "Profile";
const friendsName = "Friends List";

const Tab = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={friendsName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let routeName = route.name;

            if (Platform.OS === "ios") {
              if (routeName === homeName) {
                iconName = focused ? "home" : "home-outline";
              } else if (routeName === feedName) {
                iconName = focused ? "paper" : "paper-outline"; 
              } else if (routeName === friendsName) {
                iconName = focused ? "person-add" : "person-add-outline"; 
              } else if (routeName === profileName) {
                iconName = focused ? "person" : "person-outline";
              }
            } else {
              if (routeName === homeName) {
                iconName = "home";
              } else if (routeName === feedName) {
                iconName = focused ? "rss-feed" : "rss-feed";
              } else if (routeName === friendsName) {
                iconName = focused ? "group" : "group";
              } else if (routeName === profileName) {
                iconName = focused ? "person" : "person-outline";
              }
            }

            // Render the appropriate icon component based on the platform
            return Platform.OS === "ios" ? (
              <Ionicons name={iconName} size={size} color={color} />
            ) : (
              <MaterialIcons name={iconName} size={size} color={color} />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: "tomato",
          inactiveTintColor: "grey",
        }}
      >
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={feedName} component={FeedScreen} />
        <Tab.Screen name={friendsName} component={FriendsScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
