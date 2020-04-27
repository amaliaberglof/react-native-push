import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
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

export default class LinksScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      user : undefined,
      login: false,
      buttonText:'',
      signup:false,
      buttonHide:false,
    }
  }

  render() {
    return (
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>
        {(this.state.user === undefined) ? 
        (this.state.buttonHide === true ? <View style={styles.Wrapper}><Input 
          id="email"
          placeholder="Email"/>
        <Input
          id="password"
          secureTextEntry={true}
          placeholder="Password"/>
        <TouchableOpacity
          style={styles.userButton}
          onPress={() => {
            if(this.state.signup) {
              const email = document.getElementById("email").value
              const password = document.getElementById("password").value
              const auth = firebase.auth();
              const promise = auth.createUserWithEmailAndPassword(email,password)
              promise
                .then(user => this.setState({user:user.user.uid}))
                .catch(e => alert(e.message))
            }
            else if(this.state.login) {
              const email = document.getElementById("email").value
              const password = document.getElementById("password").value
              const auth = firebase.auth();
              const promise = auth.signInWithEmailAndPassword(email,password)
              promise
                .then(user => this.setState({user:user.user.uid}))
                .catch(e => alert(e.message))
            }
          }}
        ><Text style={styles.userButtonText}>{this.state.buttonText}</Text></TouchableOpacity></View>:<View style={styles.Wrapper}>
          <TouchableOpacity
            style={styles.myButton} 
            onPress={() => {
              this.setState({login:true, signup:false, buttonHide:true, buttonText:'Log in'})
            }}>
              <Text style={styles.myButtonText}>Log in</Text>
          </TouchableOpacity>
          </View>):<Text>You're now logged in! Go have some fun!</Text>}
          {this.state.user === undefined ? 
          (this.state.signup ? <Text onPress={() => {this.setState({signup:false, login:true, buttonText:'Log in'})}}
                                    style ={styles.signUpText}>Click here if you want to login instead</Text>:
          <Text style={styles.signUpText}
            onPress={() => {
              this.setState({signup:true, login:false, buttonHide:true, buttonText:'Sign up'})
            }}>Click here if you don't have an account</Text>):<Text></Text>}
            {/* <OptionButton
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
      /> */}
    </View>
    )
  }

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
    alignItems: 'center',
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
  myButton: {
    backgroundColor: "#52c8f7",
    borderRadius: 10,
    width:80,
    height:40,
    alignItems:'center',
    justifyContent: 'center',
    margin:5,
  },
  myButtonText: {
    fontSize:20
  },
  userButton: {
    width:150,
    height:50,
    margin:5,
    backgroundColor: '#52f7a7',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  userButtonText: {
    fontSize: 30,
    color: 'white'
  },
  Wrapper: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize:15,
    margin:10

  }
});
