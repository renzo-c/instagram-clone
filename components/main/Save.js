import React, { useState } from "react";

import { StyleSheet, Button, Image, TextInput, View } from "react-native";

import firebase from "firebase";
import "firebase/firestore";
import "firebase/firebase-storage";


const Save = ({ navigation, route }) => {
  const [caption, setCaption] = useState("");
  const {
    params: { image },
  } = route;

  const savePostData = (downloadURL) => {
    firebase.firestore().collection('posts').doc(firebase.auth().currentUser.uid).collection("userPosts").add({
        downloadURL,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp()
    }).then( () => navigation.popToTop())
  }

  const uploadImage = async () => {
    const uri = image;
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;

    const response = await fetch(uri);
    const blob = await response.blob();
    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: image }} style={styles.image} />
      <TextInput
        placeholder="Write a Caption..."
        onChangeText={(text) => setCaption(text)}
      />
      <Button title="Save" onPress={uploadImage} />
    </View>
  );
};

export default Save;

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});
