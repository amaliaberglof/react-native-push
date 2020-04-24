import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import FindScreen from './FindScreen.js'
import { MonoText } from '../components/StyledText';
import {getStoresInCity, getClosestStore, getStoreInventory} from '../apiFunctions'

export default class HomeScreen extends React.Component {

  constructor() {
        super();
        this.state = {
            stores: [],
            closestStore: "",
            storeId: "",
            storeItems: []};
        this.getInventory = this.getInventory.bind(this);
        this.getStores();
        this.getStore();
    }

    getStores(){
        getStoresInCity('stockholm').then(data=> this.setState({stores: data.items}))
    }
    getStore(){
        getClosestStore(57.709111, 11.960399)
        .then(data=> this.setState({
            closestStore: data.items[0].address,
            storeId: data.items[0].id
        }, () => this.getInventory()))
    }

    getInventory(){
        getStoreInventory(this.state.storeId).then(data => this.setState({storeItems: data.items}))
    }

    render(){
        let slice = this.state.stores.slice(0, 5);

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

                  <Text style={styles.infoText}>
                    <h2>Here's some stores in Stockholm</h2>
                      {slice.map(store => <div>{store.address}</div>)}

                      <h2>This is your closest store: (does not adapt to user geolocation, lat and long are hardcoded atm)</h2>
                      <div>{this.state.closestStore}</div>

                      <h2>Here's a drink from that store:</h2>
                      {(this.state.storeItems.length <= 0) ? <div></div> : <div>{this.state.storeItems[Math.floor(Math.random() * (this.state.storeItems.length))].name}</div>}
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
