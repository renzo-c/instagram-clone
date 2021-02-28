import React, { useState, useEffect } from "react";

import { Button, FlatList, Image, StyleSheet, Text, View } from "react-native";

import { connect } from "react-redux";

import firebase from "firebase";
import "firebase/firestore";
import { TextInput } from "react-native-gesture-handler";

const Feed = (props) => {
  const [posts, setPosts] = useState([]);
  const { feed, following, users, usersFollowingLoaded, navigation } = props;

  useEffect(() => {
    if (usersFollowingLoaded === following.length && following.length !== 0) {
      feed.sort((x, y) => x.creation - y.creation);
      setPosts(feed);
    }
  }, [usersFollowingLoaded, feed]);

  const onLikePress = (uid, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (uid, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text>{item.user.name}</Text>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              {item.currentUserLike ? (
                <Button
                  title="Dislike"
                  onPress={() => onDislikePress(item.user.id, item.id)}
                />
              ) : (
                <Button
                  title="Like"
                  onPress={() => onLikePress(item.user.id, item.id)}
                />
              )}
              <Text
                onPress={() =>
                  navigation.navigate("Comment", {
                    postId: item.id,
                    uid: item.user.id,
                  })
                }
              >
                View Comments...
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});

export default connect(mapStateToProps, null)(Feed);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: { flex: 1, aspectRatio: 1 / 1 },
  containerImage: {
    flex: 1 / 3,
  },
});
