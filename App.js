import React, { useState, useEffect } from "react";
import { LogBox } from 'react-native';

import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import * as firebase from "firebase";
import 'firebase/firestore';
import firebaseConfig from "./utils/helpers/firebaseConfig";

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";

import { Text, View } from "react-native";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";

// Temporarily hides warning about Setting a timer for a long period of time
// LogBox.ignoreLogs(['Setting a timer']);

const store = createStore(rootReducer, applyMiddleware(thunk));

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const loggedUserListener = () => {
      firebase.auth().onAuthStateChanged((user) => {
        // console.log(user);
        if (!user) {
          setLoggedIn(false);
          setLoaded(true);
        } else {
          setLoggedIn(true);
          setLoaded(true);
        }
      });
    };
    loggedUserListener();
  });

  if (!loaded) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Add" component={AddScreen} />
          <Stack.Screen name="Save" component={SaveScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
