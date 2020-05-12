import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Button, Image, Platform, Dimensions, componentDidMount } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';
import * as firebase from 'firebase/app';
import {getStoresInCity, getClosestStore, getStoreInventory} from '../apiFunctions'

import 'firebase/auth';

const deviceWidth = Dimensions.get('window').width;

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

export default class FindScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            stores: [],
            closestStore: "",
            storeId: "",
            storeItems: [],
            userLatitude: 0,
            userLongitude: 0,
            userDrinks: [],
            currentDrink: undefined
          };
          this.getInventory = this.getInventory.bind(this);
          this.setPosition = this.setPosition.bind(this);
          this.getStore = this.getStore.bind(this);
          this.getLocation();
          this.getStores();
      }


      clicked() {
        document.getElementById("infotext").innerHTML = "A new suggestion? Ok, but...";
          if (typeof DeviceOrientationEvent.requestPermission === 'function') {
              DeviceOrientationEvent.requestPermission()
              .then(response => {
                if(response=='granted') {
                  window.addEventListener('deviceorientation', event => this.deviceOrientationListener(event))
                }
              })
              .catch(error => console.log(error))
            } else {
              window.addEventListener('deviceorientation', event => {this.deviceOrientationListener(event)})
            }
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
            }
          })
        }   
    }

        addDrink(drink){
            this.setState({userDrinks: [...this.state.userDrinks, drink]})

            var firestore = firebase.firestore();
            var drinksRef = firestore.collection("users").doc(this.state.user);
            var setWithMerge = drinksRef.set({
                drinks: [...this.state.userDrinks, drink]
            }, { merge: true });
        }
  
      getLocation() {
        if (navigator.geolocation) {
            console.log("Geolocation supported")
          navigator.geolocation.getCurrentPosition(this.setPosition);
        } else { 
          console.log("Geolocation is not supported by this browser.");
        }
      }
  
      setPosition(position) {
          console.log(position.coords)
        this.setState({
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude
        })
        this.getStore(0);
      }
  
      getStores(){
          getStoresInCity('stockholm').then(data=> this.setState({stores: data.items}))
      }
  
      getStore(index){
          //console.log("lat, long: " + this.state.userLatitude + ", " + this.state.userLongitude)
          getClosestStore(this.state.userLatitude, this.state.userLongitude)
          .then(data=> this.setState({
              closestStore: data.items[index].address,
              storeId: data.items[index].id
          }, () => this.getInventory(index)))
      }
  
      getInventory(index){
          getStoreInventory(this.state.storeId).then(data => 
              (data != undefined) ? (this.setState({storeItems: data.items}), this.getSingleDrink()) :
              this.getStore(index + 1)
              )   //if the store inventory is undefined, take the next store

      }

      getSingleDrink() {
        if(this.state.storeItems.length > 0) {
          console.log(this.state.storeItems)
          var singledrink = this.state.storeItems[Math.floor(Math.random() * (this.state.storeItems.length))]
          var singledrinkInfo = {...singledrink, location:this.state.closestStore}
          this.setState({currentDrink: singledrinkInfo, currentDrinkName: singledrinkInfo.name})
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
      
      deviceOrientationListener(event) {
        // Future:
        //var neededDirection = Math.floor(Math.random() * 360);
        var neededDirection = 60;
        document.getElementById("directionNeeded").innerHTML = "Your phone needs to be in direction: " + neededDirection;
    
        var alpha   = event.alpha; //z axis rotation [0,360)
        var beta     = event.beta; //x axis rotation [-180, 180]
        var gamma   = event.gamma; //y axis rotation [-90, 90]
    
        //Check if absolute values have been sent
        if (typeof event.webkitCompassHeading !== "undefined") {
          alpha = event.webkitCompassHeading; //for iOS devices
          var heading = alpha
        }
        document.getElementById("direction").innerHTML = "Your phone is currently in direction: " + Math.floor(alpha);
        if( Math.floor(alpha)==neededDirection){
          document.getElementById("success").innerHTML = "Success!";
          this.getSingleDrink();
        }
      }

    render(){
        let slice = this.state.stores.slice(0, 5);

        return (
        <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> 
            <Text style={styles.headerText}>
                Hitta närmsta Systembolag
            </Text>

            <View style={styles.infoContainer}>
            {/* <Button 
            title="FIND CLOSEST"
            onPress={() => {this.getLocation()
            }}
            /> */}


            <div id="position"></div>
                
                <Text style={styles.infoText}>
                    {/* <h2>Here's some stores in Stockholm</h2>
                        {slice.map((store, i) => <div key={i}>{store.address}</div>)} */}

                    <h2>This is your closest store: (With an invetory)</h2>
                        <div>{this.state.closestStore}</div>

                    <h2>Here's a drink from that store:</h2>
                        {(this.state.storeItems.length <= 0) ? <div></div> : <div>{this.state.currentDrinkName}</div>}
                    
                    <Button 
                        title="Add this drink!" 
                        onPress={() => {this.addDrink(this.state.currentDrink)}}
                        disabled={this.state.user === undefined}
                    
                    />
                    
                 </Text>
                 <Button 
                          title="No! I want a new drink >:("
                          onPress={() => {this.clicked()
                          }}
                          />
                          <div id="infotext"></div>
                          <div id="directionNeeded"></div>
                          <div id ="direction"></div>
                          <div id="success"></div>
                 <Text>
                    <h2>Here are your stored drinks:</h2>
                        {this.state.userDrinks === undefined? undefined : this.state.userDrinks.map((drink, i) => <div key={i}>{drink.name}</div>)}
                </Text>
            </View>
        </ScrollView>
        </View>
        
        )
    }
  }
  // function deviceOrientationListener(event) {
  //   // Future:
  //   //var neededDirection = Math.floor(Math.random() * 360);
  //   var neededDirection = 60;
  //   document.getElementById("directionNeeded").innerHTML = "Your phone needs to be in direction: " + neededDirection;

  //   var alpha   = event.alpha; //z axis rotation [0,360)
  //   var beta     = event.beta; //x axis rotation [-180, 180]
  //   var gamma   = event.gamma; //y axis rotation [-90, 90]

  //   //Check if absolute values have been sent
  //   if (typeof event.webkitCompassHeading !== "undefined") {
  //     alpha = event.webkitCompassHeading; //for iOS devices
  //     var heading = alpha
  //   }
  //   document.getElementById("direction").innerHTML = "Your phone is currently in direction: " + Math.floor(alpha);
  //   if( Math.floor(alpha)==neededDirection){
  //     document.getElementById("success").innerHTML = "Success!";
  //     FindScreen.getSingleDrink();

  //   }
  // }
    

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
    },
    contentContainer: {
      paddingTop: 0,
    },
    headerText: {
      fontSize: 40,
      color: 'rgba(96,100,109, 1)',
      textAlign: 'center',
      fontWeight: 'bold',
      paddingTop: '0.4em',
    },
    infoContainer: {
      position: 'relative',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
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

    },
    mapImage: {
      margin: 10,
      flex: 1,
      width: deviceWidth * 0.8,
      height: deviceWidth * 0.8,
      resizeMode: 'contain',
    },
    overlay: {
      display:'block',
      position: 'fixed', /* Sit on top of the page content */
      width: '100%', /* Full width (cover the whole page) */
      height: '100%', /* Full height (cover the whole page) */
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', /* Black background with opacity */
      cursor: 'pointer', /* Add a pointer on hover */
  },  
  overlayText: {
    padding:'20%',
    fontSize: '100px',
    textAlign: 'center',
    color: 'white',
}

  });
  
