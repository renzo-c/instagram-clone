import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput } from "react-native";

import firebase from "firebase";
import "firebase/firestore";

import {connect} from 'react-redux';
import { bindActionCreators } from "redux";
import {fetchUsersData} from '../../redux/actions/index';

const Comment = (props) => {
  const { route, users, fetchUsersData } = props;
  const { params } = route;
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const matchUserToComments = comments => {
      for(let i = 0; i < comments.length; i += 1) {
        
        if(comments[i].hasOwnProperty('user')) {
          continue;
        }
        
        const user = users.find(x => x.id === comments[i].creator);
        if(user === undefined) {
          fetchUsersData(comments[i].creator, false)
        } else {
          comments[i].user = user 
        }
      }
      setComments(comments)
    }

    if (params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(params.uid)
        .collection("userPosts")
        .doc(params.postId)
        .collection("comments")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const { id } = doc;
            const data = doc.data();
            return { id, ...data };
          });
          matchUserToComments(comments);
        });
      setPostId(params.postId);
    } else {
      matchUserToComments(comments);
    }
  }, [params.postId], users);

  const onCommentSend = () => {
    firebase
        .firestore()
        .collection("posts")
        .doc(params.uid)
        .collection("userPosts")
        .doc(params.postId)
        .collection("comments").add({creator: firebase.auth().currentUser.uid, text})
  }
  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View>
            {item.user !== undefined ? <Text>{item.user.name}</Text> : null}
            <Text>{item.text}</Text>
          </View>
        )}
      />
      <View>
        <TextInput
          placeholder="comment..."
          onChangeText={(text) => setText(text)}
        />
        <Button onPress={() => onCommentSend()} title="Send" />
      </View>
    </View>
  );
};


const mapStateToProps = (store) => ({
  users: store.usersState.users
})

const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUsersData}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
