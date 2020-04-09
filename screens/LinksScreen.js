import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';
import * as firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyAof_5Wo36Wn2B4vdT6ncqdOBeZRdFGsmE",
  authDomain: "findthedrink.firebaseapp.com",
  databaseURL: "https://findthedrink.firebaseio.com",
  projectId: "findthedrink",
  storageBucket: "findthedrink.appspot.com",
  messagingSenderId: "504646558883",
  appId: "1:504646558883:web:7426365e9266368d654b16",
  measurementId: "G-FCM6BTPP6X"
};

firebase.initializeApp(config);

export default function LinksScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <OptionButton
        icon="md-school"
        label="Read the Expo documentation"
        onPress={() => WebBrowser.openBrowserAsync('https://docs.expo.io')}
      />

      <OptionButton
        icon="md-compass"
        label="Read the React Navigation documentation"
        onPress={() => WebBrowser.openBrowserAsync('https://reactnavigation.org')}
      />

      <OptionButton
        icon="ios-chatboxes"
        label="Ask a question on the forums"
        onPress={() => WebBrowser.openBrowserAsync('https://forums.expo.io')}
        isLastOption
      />
      <Input 
        id="email"
        placeholder="email"/>
      <Input
        id="password"
        secureTextEntry={true}
        placeholder="Password"/>
      <Button 
        title="Login"
        onPress={() => console.log("Hej")}
      />
      <Button 
        title="Sign in"
        onPress={() => {
          const email = document.getElementById("email").value
          const password = document.getElementById("password").value
          const auth = firebase.auth();
          const promise = auth.createUserWithEmailAndPassword(email,password)
          promise
            .then(() => console.log("Yaaay"))
            .catch(e => console.log(e.message))
        }}
      />
    </ScrollView>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
