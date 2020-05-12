import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Button, Platform, Image } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

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
      userName: undefined,
      userDrinks: undefined,
    }
  }

  addUserToDatabase(userID) {
    const db = firebase.firestore()
    db.collection("users").doc(userID).set({
      username: 'Username'
    })
    .then(() => {
        this.setState({userName: 'Username'})
        console.log("Document written")
    })
    .catch((err) => {
        console.log("Error while writing, ", err)
    })
  }
    //Denna är inte helt utvecklad än. För att funka bäst (just nu) borde den köras
    // i componentDidMount eller liknande, men får vi upp en redux store så kommer vi kunna använda denna bättre
  fetchUserName(userID) {
    const db = firebase.firestore();
    db.collection("users").doc(userID).get().then(doc => {
        if(doc.exists) {
              this.setState({userName: doc.data().username})
        }
        else {
            console.log("No such user in database")
        }
    }).catch((err) => {
        console.log(err)
    })
  }

  LogOut() {
    firebase.auth().signOut();
    this.setState({user: undefined})
    this.setState({userName: undefined})
  }

  getUserDrinks(){
    if (this.state.user !== undefined) {
      //Lay connection with the database.
      var drinks = []
      var firestore = firebase.firestore();
      var coll = firestore.collection("users").doc(this.state.user)
      coll.get().then(doc => {
        console.log(doc.data())
        if (doc.data().drinks !== undefined){
            doc.data().drinks.forEach(drink => drinks.push(drink))
            this.setState({userDrinks: drinks})
            console.log(drinks)
        }
      })
    }   
}

  handleStateChange = (user) => {
    if(user) {
      this.setState({user:user.uid})
      this.getUserDrinks();
    }
    else {
      console.log("Not logged in")
    }

  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.handleStateChange);
  }


  render() {
    return (
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>

        {/* VIEW 1 */}
        {(this.state.user === undefined) ? 

        // To be displayed before the user logs in
        (this.state.buttonHide === true ? 
        <View style={styles.Wrapper}>
          <Input 
            id="email"
            placeholder="Email"/>
          <Input
            id="password"
            secureTextEntry={true}
            placeholder="Password"/>
          <TouchableOpacity
            style={styles.userButton}

            // Logging in:
            onPress={() => {
              if(this.state.signup) {
                const email = document.getElementById("email").value
                const password = document.getElementById("password").value
                const auth = firebase.auth();
                const promise = auth.createUserWithEmailAndPassword(email,password)
                promise
                .then(user => {
                  this.setState({user:user.user.uid})
                  this.addUserToDatabase(user.user.uid)
                })
                  .catch(e => alert(e.message))
              }
              else if(this.state.login) {
                const email = document.getElementById("email").value
                const password = document.getElementById("password").value
                const auth = firebase.auth();
                const promise = auth.signInWithEmailAndPassword(email,password)
                promise
                .then(user => {
                  this.setState({user:user.user.uid})
                  this.fetchUserName(user.user.uid)
                })
                  .catch(e => alert(e.message))
              }
            }}>
              
          <Text style={styles.userButtonText}>{this.state.buttonText}</Text>
          </TouchableOpacity></View>:<View style={styles.Wrapper}>

          <TouchableOpacity
            style={styles.myButton} 
            onPress={() => {
              this.setState({login:true, signup:false, buttonHide:true, buttonText:'Log in'})
            }}>

          <Text style={styles.myButtonText}>Log in</Text>
          </TouchableOpacity>


          <View>
          {this.state.signup ? <Text onPress={() => {this.setState({signup:false, login:true, buttonText:'Log in'})}}
                                    style ={styles.signUpText}>Click here if you want to login instead</Text>:
          <Text style={styles.signUpText}
            onPress={() => {
              this.setState({signup:true, login:false, buttonHide:true, buttonText:'Sign up'})
            }}>Click here if you don't have an account</Text>}
          </View>
          </View>)
          
          :
          // VIEW 2
          // PROFILE PAGE:
            profileView(this.state.userName, this.state.userDrinks)
          }
  
    </View>
    )
  }
}


const profileView = (username, drinks) => {
  return(
    (<View style={styles.Wrapper}>
        
        <Image source={require('../assets/images/avatar2.png')} style={styles.avatarImage}/>

        <Text style={styles.infoText}><br/>HELLO {username}!<br/></Text>

        <Text style={styles.infoText}>Here are the drinks you have saved:</Text> 
        {drinks === undefined? <div>You haven't saved any drinks</div> : drinks.map((drink,index) => (
         <div key={index}>
          <TabBarIcon name="ios-beer"/>
          <span key={index}>  {drink}</span>
        </div>))}

          <TouchableOpacity
          style={styles.userButton}
          onPress={() => {
            this.LogOut()
          }}
        ><Text style={styles.userButtonText}>Log out</Text></TouchableOpacity>
    </View>)
  )
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

  },
  avatarImage: {
    width: 900,
    height: 200,
    resizeMode: 'contain',
    marginTop: 1,
    marginBottom: 0,
    marginLeft: -10,  }
});
