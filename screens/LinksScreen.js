import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
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
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        <Text style={styles.headerText}>
          Logga in
        </Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Input 
              id="email"
              placeholder="email"/>
            <Input
              id="password"
              secureTextEntry={true}
              placeholder="Password"/>
              </Text>
            <Text style={styles.infoText}>
            <Button 
              title="Login"
              onPress={() => console.log("Hej")}
            />
            </Text>
            <Text style={styles.infoText}>
            <Button
              title="Sign up"
              color="#9c9c9c"
              
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
          </Text>
        </View>

    </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  contentContainer: {
    paddingTop: 0,
  },
  headerText: {
    fontSize: 48,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingTop: '0.3em',
  },
  infoContainer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    margin:40,
  },
  infoText: {
    fontSize: 18,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'left',
    margin: 5,
    color: 'black',
  },
});