import React, { useState, useEffect } from "react";

import { Button, FlatList, Image, StyleSheet, Text, View } from "react-native";

import { connect } from "react-redux";

import firebase from "firebase";
import "firebase/firestore";

const Profile = (props) => {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);

  const [following, setFollowing] = useState(false);
  const { currentUser, posts, route } = props;
  const {
    params: { uid },
  } = route;

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(uid)
      .set({});
  };

  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut()
  }

  useEffect(() => {
    const runThis = () => {
      if (firebase.auth().currentUser.uid === uid) {
        setUser(currentUser);
        setUserPosts(posts);
      } else {
        firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              setUser(snapshot.data());
            } else {
              console.log("does not exist");
            }
          });

        firebase
          .firestore()
          .collection("posts")
          .doc(uid)
          .collection("userPosts")
          .orderBy("creation", "asc")
          .get()
          .then((snapshot) => {
            const posts = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data };
            });
            setUserPosts(posts);
          });
      }
      
      if(props.following.indexOf(uid) > -1) {
        setFollowing(true)
      } else {
        setFollowing(false)
      }
    };
    runThis();
  }, [uid, props.following]);

  if (user === null) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
        {uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button title="Following" onPress={onUnfollow} />
            ) : (
              <Button title="Follow" onPress={onFollow} />
            )}
          </View>
        ) : <Button title="Logout" onPress={onLogout}/> }
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following
});

export default connect(mapStateToProps, null)(Profile);

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
