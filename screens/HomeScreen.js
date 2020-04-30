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

              <Text style={styles.headerText}>FindTheDrink</Text>
              <View style={styles.infoContainer}>

                  <Image source={require('../assets/images/26711.jpg')} style={styles.cheersImage}/>
                  
                  <Text style={styles.infoText}>
                    <br />
                    Såhär funkar det:
                    <ul>
                    <li>När du klickar på starta kommer appen hitta ditt närmsta systembolag</li>
                    <li>Skaka din telefon! Shake it! shake it!</li>
                    <li>En rekommendation på dryck från detta bolag kommer dyka upp</li>
                    </ul>
                  </Text> 

                  <Button onPress={() => 
                    {console.log("This button is out of order. :( Please use 'find drink' längst ner i fönstret istället, sålänge liksom")
                    }}
                    title="STARTA">
                  </Button>

                  <Text style={styles.helpLinkText}>
                    <div>Eller <u>logga in</u> för att se dina sparade förslag</div>
                  </Text>
              </View>
            </ScrollView>
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
  cheersImage: {
    width: 900,
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginBottom: 0,
    marginLeft: -10,
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
    textAlign: 'left',
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
    margin:10,
  },
});
