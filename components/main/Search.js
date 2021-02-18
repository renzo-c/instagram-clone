import React, { useState } from "react";

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TochableOpacity,
  View,
} from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";

const Search = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", search)
      .get()
      .then((snapshot) => {
        const users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Type Here"
        onChangeText={(text) => fetchUsers(text)}
        style={{ borderColor: "black", borderWidth: 5 }}
      />
      <FlatList
        numColumns={1}
        data={users}
        horizontal={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile", { uid: item.id })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
});
