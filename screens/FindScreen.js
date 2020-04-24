import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Button, Image, Platform, Dimensions } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Input } from 'react-native-elements';
import * as firebase from 'firebase/app';

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
  


export default function FindScreen() {

    return (
      <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> 
        <View style={styles.tabBarInfoContainer}>
           
      {/* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> */}

            <Image
                      source={
                      __DEV__
                          ? require('../assets/images/map.png')
                          : require('../assets/images/map.png')
                      }
                      style={styles.mapImage}
                  />


        <Button 
          title="FIND CLOSEST"
          onPress={() => {console.log("you press!")
          }}
        />
                  </View>
      </ScrollView>
      </View>
      
    );
  }
 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
    },
    contentContainer: {
      paddingTop: 0,
    },
    tabBarInfoContainer: {
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
  