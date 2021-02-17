import React, { useState } from "react";
import { View, Button, TextInput } from "react-native";

import firebase from "firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <TextInput placeholder="email" onChangeText={(email) => setEmail(email)} />
      <TextInput
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Button onPress={onSignIn} title="Login" />
    </View>
  );
};

export default Login;
