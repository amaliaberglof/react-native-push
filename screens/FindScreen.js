import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Button, Image, Platform, Dimensions, componentDidMount, Alert } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';
import * as firebase from 'firebase/app';
import {getStoresInCity, getClosestStore, getStoreInventory} from '../apiFunctions'
import GoogleMapReact from 'google-map-react';

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
            currentDrink: undefined,
            errMessage: undefined,
            storeCoords: undefined,
            neededDirection: 0,
          };
          this.getRandomStore = this.getRandomStore.bind(this)
          this.getRandomInventory = this.getRandomInventory.bind(this)
          this.getInventory = this.getInventory.bind(this);
          this.setPosition = this.setPosition.bind(this);
          this.getStore = this.getStore.bind(this);
          this.getLocation();
          this.getStores();
          this.clicked();
      }


      clicked() {
          // Future:
          this.setState({neededDirection: Math.floor(Math.random() * 360)});
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
        if (this.props.user !== undefined) {
          //Lay connection with the database.
          var drinks = []
          var firestore = firebase.firestore();
          var coll = firestore.collection("users").doc(this.props.user)
          coll.get().then(doc => {
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
            var drinksRef = firestore.collection("users").doc(this.props.user);
            var setWithMerge = drinksRef.set({
                drinks: [...this.state.userDrinks, drink]
            }, { merge: true });
        }
  
      getLocation() {
        if (navigator.geolocation) {
            console.log("Geolocation supported")
              navigator.geolocation.getCurrentPosition(this.setPosition, this.getRandomStore);
        } else { 
          console.log("Geolocation is not supported by this browser.");
        }
      }
  
      setPosition(position) {
        if(position.coords !== undefined) {
          document.getElementById("sorryMessage").innerHTML = "";
          console.log(position.coords)
        this.setState({
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude
        })
        this.getStore(0);
      }
      }
  
      getStores(){
          getStoresInCity('stockholm').then(data=> this.setState({stores: data.items})).catch(err => {
            console.log(err)
            this.setState({errMessage: 'There was an error with the API :( Try again!'})
          })
      }

      getRandomStore() {
        getStoresInCity('stockholm').then(data=> {
          var randomStore = data.items[Math.floor(Math.random() * (data.items.length))]
          this.setState({
            storeCoords: {lat: parseFloat(randomStore.lat), lng: parseFloat(randomStore.lng)},
            closestStore: randomStore.address,
            storeId: randomStore.id
        })
      }).then(() => this.getRandomInventory(this.state.storeId)).catch(err => {
        console.log(err)
        this.setState({errMessage: 'There was an error with the API :( Try again!'})
      })
        
      }

      getRandomInventory(storeId) {
        getStoreInventory(storeId).then(data => {
          (data != undefined) ? (this.setState({storeItems:data.items}), this.getSingleDrink())
          : this.getRandomStore();
        }).catch(err => {
          console.log(err)
          this.setState({errMessage: 'There was an error with the API :( Try again!'})
        })
      }
  
      getStore(index){
          //console.log("lat, long: " + this.state.userLatitude + ", " + this.state.userLongitude)
          getClosestStore(this.state.userLatitude, this.state.userLongitude)
          .then(data=> this.setState({
              storeCoords: {lat: parseFloat(data.items[index].lat), lng: parseFloat(data.items[index].lng)},
              closestStore: data.items[index].address,
              storeId: data.items[index].id
          }, () => this.getInventory(index))).catch(err => {
            console.log(err)
            this.setState({errMessage: 'There was an error with the API :( Try again!'})
          })
      }
  
      getInventory(index){
          getStoreInventory(this.state.storeId).then(data => 
              (data != undefined) ? (this.setState({storeItems: data.items}), this.getSingleDrink())
               :
              this.getStore(index + 1)
              )   //if the store inventory is undefined, take the next store
              .catch(err => {
                console.log(err)
                this.setState({errMessage: 'There was an error with the API :( Try again!'})
              })
      }

      getSingleDrink() {
        if(this.state.storeItems.length > 0) {
          var singledrink = this.state.storeItems[Math.floor(Math.random() * (this.state.storeItems.length))]
          var singledrinkInfo = {...singledrink, location:this.state.closestStore}
          this.setState({currentDrink: singledrinkInfo, currentDrinkName: singledrinkInfo.name})
          this.setState({neededDirection: Math.floor(Math.random() * 360)});
        }

      }

      componentDidMount() {
        this.getUserDrinks();
      }
  
      
      deviceOrientationListener(event) { 
        document.getElementById("errorMessage").innerHTML = "";

        var alpha   = event.alpha; //z axis rotation [0,360)
        var beta     = event.beta; //x axis rotation [-180, 180]
        var gamma   = event.gamma; //y axis rotation [-90, 90]
    
        //Check if absolute values have been sent
        if (typeof event.webkitCompassHeading !== "undefined") {
          alpha = event.webkitCompassHeading; //for iOS devices
          var heading = alpha
        }

        document.getElementById("direction").innerHTML =  "Your phone is currently in direction: " + Math.floor(alpha) + "°";
        document.getElementById("directionNeeded").innerHTML = "To get a new drink suggestion, please point your phone in direction: " + this.state.neededDirection + "°";
    


        if( Math.floor(alpha)==this.state.neededDirection){
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
            <div id="sorryMessage" style={{color: 'red', fontFamily: 'Helvetica, arial, sans-serif'}}>We're sorry! We can't find your location. We'll randomize a store for you!</div>
            {this.state.storeCoords === undefined? undefined : <div style={{ height: '30vh', width: '100%', margin: ''}}>
                          <GoogleMapReact
                              //bootstrapURLKeys={{ key: /* YOUR KEY HERE */ }}
                              defaultCenter={{
                                  lat: this.state.storeCoords.lat,
                                  lng: this.state.storeCoords.lng
                              }}
                              defaultZoom={16}
                          >
                          </GoogleMapReact>
             </div>}
                
                <Text style={styles.infoText}>

                    <h2>This is your closest store: (With an inventory)</h2>
                        <div>{this.state.closestStore}</div>

                    <h2>Here's a drink from that store:</h2>
                    <View style={styles.suggestionRowItem}>

                      {(this.state.storeItems.length <= 0) ? <div></div> : <div>{this.state.currentDrinkName}</div>}
                      </View>
                      <View style={styles.suggestionRowItem}>
                        <Button title="SAVE"  onPress={() => {this.addDrink(this.state.currentDrink), document.getElementById("confirmMessage").innerHTML = this.state.currentDrinkName +  " added!";
                                          }} disabled={this.props.user === undefined || this.state.currentDrink === undefined} />
                                              
                      </View>
                      <div id="confirmMessage" style={{color: 'grey', fontStyle: 'italic'}}></div>     
                  
                      </Text>
                      <View style={styles.directions}>
                      <h2 style={{fontFamily: 'Helvetica, arial, sans-serif'}}>Get a new suggestion:</h2>

                        <div id="errorMessage" style={{color: 'red', fontFamily: 'Helvetica, arial, sans-serif'}}>No device orientation found :( You need device orientation to get a new suggestions.</div>
                        <Text>
                        <div id="directionNeeded" style={{fontFamily: 'Helvetica, arial, sans-serif'}}></div>

                        </Text>
                        <View style={styles.innerDirections}>
                          <Text>
                            <div id ="direction" style={{fontFamily: 'Helvetica, arial, sans-serif'}}></div>
                          </Text>
                        </View>
                      </View>

            </View>
        </ScrollView>
        {this.state.errMessage !== undefined ? Alert.alert(
          "Oops", this.state.errMessage, { cancelable: false }
        ):<div></div>}
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
    suggestionRowItem: {
      // float: 'left',
      margin: '10px',
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
},
  directions: {
    backgroundColor: '#C3E3FB',
    borderRadius: '25px',
    padding: '1em',
    margin: '1em',
  },
  innerDirections: {
    backgroundColor: '#82B2D7',
    borderRadius: '25px',
    padding: '0.8em',
    margin: '0.3em',

  }


  });
  
