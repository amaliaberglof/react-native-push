import { Ionicons } from '@expo/vector-icons';
import TabBarIcon from '../components/TabBarIcon';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Button, Platform, Image, Alert, Modal, TouchableHighlight } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
      login: false,
      buttonText:'',
      signup:false,
      buttonHide:false,
      userDrinks: undefined,
      focusDrink: undefined,
      modalVisible: false,
      deleteMode:false,
    }
  }

  addUserToDatabase() {
    const db = firebase.firestore()
    db.collection("users").doc(this.props.user)
    .then(() => {
        console.log("Document written")
    })
    .catch((err) => {
        console.log("Error while writing, ", err)
    })
  }

  LogOut() {
    firebase.auth().signOut();
  }

  getUserDrinks(){
    if (this.props.user !== undefined) {
      //Lay connection with the database.
      var drinks = []
      var firestore = firebase.firestore();
      var coll = firestore.collection("users").doc(this.props.user)
      coll.get().then(doc => {
        if(doc.exists) {
          if (doc.data().drinks !== undefined){
            doc.data().drinks.forEach(drink => drinks.push(drink))
            this.setState({userDrinks: drinks})
        }
        }
      })
    }
    
}

deleteDrink() {
  var filteredDrinks = this.state.userDrinks.filter(drink => drink.id !== this.state.focusDrink.id)
  this.setState({userDrinks: filteredDrinks})
  var db = firebase.firestore();
  setTimeout(() => db.collection("users").doc(this.props.user).set({
    drinks: this.state.userDrinks
  }, {merge: true}).then(() => console.log("deleted")).catch(err => console.log(err)),1000)
}

  componentDidMount() {
    this.getUserDrinks();
  }


  render() {
    return (
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>

        {/* VIEW 1 */}
        {(this.props.user === undefined) ? 

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
                  this.addUserToDatabase()
                })
                  .catch(e => alert(e.message))
              }
              else if(this.state.login) {
                const email = document.getElementById("email").value
                const password = document.getElementById("password").value
                const auth = firebase.auth();
                const promise = auth.signInWithEmailAndPassword(email,password)
                promise
                  .catch(e => 
                    console.log(e.message))
              }
            }}>
              
          <Text style={styles.userButtonText}>{this.state.buttonText}</Text>
          </TouchableOpacity>

          <View>
          {this.state.signup ? <Text onPress={() => {this.setState({signup:false, login:true, buttonText:'Log in'})}}
                                    style ={styles.signUpText}>Click here if you want to login instead</Text>:
          <Text style={styles.signUpText}
            onPress={() => {
              this.setState({signup:true, login:false, buttonHide:true, buttonText:'Sign up'})
            }}>Click here if you don't have an account</Text>}
          </View>
          
          </View>:<View style={styles.Wrapper}>

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
            (
            <View style={styles.Wrapper}>
              <View style={styles.ProfileView}>
        
                 <Image source={require('../assets/images/avatar2.png')} style={styles.avatarImage}/>

                  <Text style={styles.infoText}><br/>HELLO!<br/></Text>

                  {this.state.userDrinks === undefined || this.state.userDrinks.length === 0 ? 
                  <Text style={styles.infoText}>You haven't saved any drinks.<br/>
                  Begin by browsing the Find drink-tab.</Text>
                  :
                  <Text style={styles.infoText}>Here are the drinks you have saved. 
                  <br/>Tap on the beer-icon to get more information 
                  <br/>about the drink. Tap the drink to be able to delete.</Text> }
                  {this.state.userDrinks === undefined? <div></div> 
                  : this.state.userDrinks.map((drink,index) => (
                    <div key={index}>
                    <Ionicons 
                      name="ios-beer"
                      size={30}
                    onPress={() => this.setState({focusDrink:drink, modalVisible:true, deleteMode:true})}/>
                    <Text onPress={() => this.setState({focusDrink:drink, deleteMode:true})}style={styles.infoText} key={index}> {drink.name}</Text>
                    {this.state.deleteMode && this.state.focusDrink.name === drink.name ? <Ionicons onPress={() => this.deleteDrink()} name="md-trash" size={30}/> : <Text></Text>}
                  </div>))}
                  
              </View>
              <TouchableOpacity
                style={styles.userButton}
                onPress={() => {
                  this.LogOut()
                }}>
                <Text style={styles.userButtonText}>Log out</Text>
              </TouchableOpacity>
              {this.state.modalVisible ?
            
            // The pop-up window for the drink
            <View 
            onTouchEndCapture
            ={() => this.setState({modalVisible:false})}
            style={styles.modal}>
              <View style={styles.modalContent}>
                <View style={styles.closeModal}>
                  <Text
                  onPress={() => this.setState({modalVisible:false})}
                  style={styles.closeModalText}>X</Text></View>
              
              {/* Content */}
              <Image source={require('../assets/images/beer.png')} style={styles.beerLogo}/>
              <Text style={styles.drinkHeader}>{this.state.focusDrink.name}</Text>
              <View style={styles.drinkInfo}>
                <Text style={styles.boldText}>Found at {this.state.focusDrink.location}</Text>
                
                {this.state.focusDrink.items < 15 ? <Text>This item is almost out of stock!<br/><br/></Text>:<Text style={styles.centerText}>You don't need to rush - there's a lot of this drink at the store<br/><br/></Text>}
                
                <Text>Cost: {this.state.focusDrink.price} SEK | Alc.: {this.state.focusDrink.alcohol_vol}% | APK: {(this.state.focusDrink.alcohol_vol/this.state.focusDrink.price).toFixed(2)} <br/><br/></Text>
                <Text style={styles.centerText}>Country: {this.state.focusDrink.country} | Producer: {this.state.focusDrink.producer}<br/><br/></Text>
                
              </View>
              </View>
            </View> :<div></div>}
    </View>)
            
          }
  
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
    textAlign: 'center',
    margin: 5,
    color: 'black',
  },
  boldText:{
    fontWeight: 'bold'
  },
  centerText:{
    textAlign: 'center'
  },
  myButton: {
    backgroundColor: "#429f46",
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
    backgroundColor: '#429f46',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  userButtonText: {
    fontSize: 30,
    color: 'white'
  },
  ProfileView: {
    flex:1,
    width:'80%',
    margin:10,
    alignContent: 'center',
    alignItems: 'center',
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
    marginLeft: -10,  
  },
  beerLogo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    margin: 'auto'
  },

  modal: {
    display: 'block',
    position: 'fixed', /* Stay in place */
    zIndex: 1, /* Sit on top */
    paddingTop: 30, /* Location of the box */
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%', /* Full width */
    height: '100%', /* Full height */
    overflow: 'auto', /* Enable scroll if needed */
    backgroundColor: 'rgb(0,0,0)', /* Fallback color */
    backgroundColor: 'rgba(0,0,0,0.4)', /* Black w/ opacity */
  },
  modalContent: {
    borderRadius:10,
    backgroundColor: '#fefefe',
    margin: 'auto',
    padding: 10,
    width: '80%',
    height:'80%'
  },
  drinkHeader: {
    paddingTop:25,
    fontSize: 25,
    textAlign: 'center',
  },
  closeModal: {
    width:25,
    position: 'absolute',
    top: 5,
    right: 5,
    display:'block',
    backgroundColor: 'grey',
    padding:7,
    paddingLeft:8,
    borderRadius:10,
  },
  closeModalText: {
    textAlign: 'center',
  },
  drinkInfo: {
    marginTop:10,
    alignContent: 'center',
    alignItems: 'center',
  }
});
