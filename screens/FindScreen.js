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
  
/* FIND USER POSITION */
// function getLocation() {
//   if (navigator.geolocation) {
//     //navigator.geolocation.getCurrentPosition(showPosition);
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else { 
//     document.getElementById("position").innerHTML = "Geolocation is not supported by this browser.";
//   }
// }

// function showPosition(position) {
//   document.getElementById("position").innerHTML = "Latitude: " + position.coords.latitude + 
//   "<br>Longitude: " + position.coords.longitude;
//   FindScreen.getStore(position.coords.latitude, position.coords.longitude)
// }

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
            userDrinks: undefined
          };
          this.getUserDrinks = this.getUserDrinks.bind(this);
          this.getInventory = this.getInventory.bind(this);
          this.setPosition = this.setPosition.bind(this);
          this.getStore = this.getStore.bind(this);
          this.getLocation();
          this.getStores();
          this.getUserDrinks();
      }

      getUserDrinks(){
        // Lay connection with the database.
        var firestore = firebase.firestore();
        // "4xpG9YaWAUpp39ALV8hx" is a hardcoded user id, should be dynamic!*************************************************************
        var coll = firestore.collection("users").doc("4xpG9YaWAUpp39ALV8hx").collection('testDrinks')

        coll.get().then(coll =>
            //console.log("Document data:", Object.values(coll.docs[0].data()))
            this.setState({userDrinks: Object.values(coll.docs[0].data())})
            )
        
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
              (data != undefined) ? this.setState({storeItems: data.items}) :
              this.getStore(index + 1))   //if the store inventory is undefined, take the next store
      }


      componentDidMount(){
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
            <Button 
            title="FIND CLOSEST"
            onPress={() => {this.getLocation()
            }}
            />

            {/* Navigation */}
            <Text>Device orientation:</Text>
            <div id="information"></div>
            <div id="is"></div>
            {/* Navigation */}

            <div id="position"></div>
                <Image
                        source={
                        __DEV__
                            ? require('../assets/images/map.png')
                            : require('../assets/images/map.png')
                        }
                        style={styles.mapImage}
                    />
                <Text style={styles.infoText}>
                    <h2>Here's some stores in Stockholm</h2>
                        {slice.map((store, i) => <div key={i}>{store.address}</div>)}

                    <h2>This is your closest store: (does not adapt to user geolocation, lat and long are hardcoded atm)</h2>
                        <div>{this.state.closestStore}</div>

                    <h2>Here's a drink from that store:</h2>
                        {(this.state.storeItems.length <= 0) ? <div></div> : <div>{this.state.storeItems[Math.floor(Math.random() * (this.state.storeItems.length))].name}</div>}

                    <h2>Here's your stored drinks</h2>
                        {this.state.userDrinks === undefined? undefined : this.state.userDrinks.map(drink => <div>{drink}</div>)}
                </Text>

           
            </View>
        </ScrollView>
        </View>
        
        )
    }
  }


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
  });
  
