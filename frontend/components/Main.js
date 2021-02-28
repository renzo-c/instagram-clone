import React, { useEffect } from "react";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import FeedScreen from "./main/Feed";
import ProfileScreen from "./main/Profile";
import SearchScreen from "./main/Search";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearData, fetchUserFollowing, fetchUser, fetchUserPosts } from "../redux/actions/index";

import firebase from 'firebase';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => null;

const Main = (props) => {
  const { clearData, fetchUserFollowing, fetchUser, fetchUserPosts, currentUser } = props;

  useEffect(() => {
    clearData();
    fetchUser();
    fetchUserPosts();
    fetchUserFollowing();
  }, []);

  if (currentUser === undefined) {
    return <Text>Current user undefined</Text>;
  }

  return (
    <Tab.Navigator initialRouteName="Feed" labeled={false}>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="AddContainer"
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Add");
          },
        })}
        component={EmptyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-box" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid});
          },
        })}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ clearData, fetchUser, fetchUserPosts, fetchUserFollowing }, dispatch);

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});
export default connect(mapStateToProps, mapDispatchToProps)(Main);
