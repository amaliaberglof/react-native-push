import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import FindScreen from './FindScreen.js'
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
    render(){
        return (
          <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> 

              <View style={styles.infoContainer}>

                  <Image source={require('../assets/images/frontpagelogo.png')} style={styles.logoImage}/>
                  
                  <Text style={styles.infoText}>Don't know what to drink? No worries! We will find your closest <i>Systembolag</i> and suggest a delicious beverage available there. </Text>

                  <Button onPress={() => 
                    {this.props.navigation.navigate('Find')
                    }}
                    title="FIND ME A DRINK">
                  </Button>


              </View>
            </ScrollView>
            
            <Image source={require('../assets/images/frontpageimg.png')} style={styles.bottomImage}/>


          </View>
        )
    }
}

HomeScreen.navigationOptions = {
  header: null,
};

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
  logoImage: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginBottom: 0,
    marginLeft: -10,
  },
  bottomImage: {
    width: '100%',
    height: 200,
    position: 'absolute',
    bottom:0,
    marginLeft: 0,
    paddingLeft: 0,
    resizeMode: 'contain',
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
  },
  infoText: {
    fontSize: 18,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    margin: '20px'
  },
  centerText:{
    textAlign: 'center'
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
    margin:10,
  },
});
