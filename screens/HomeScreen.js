import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import {getStoresInCity, getStoreInventory} from '../apiFunctions'

export default class HomeScreen extends React.Component {
    constructor() {
        super();
        this.state = {stores: []};
        this.getStores();
    }

    getStores(){
        getStoresInCity('stockholm').then(data=> this.setState({stores: data.items}))
    }

    render(){
        let slice = this.state.stores.slice(0, 5);

        return (
            <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.welcomeContainer}>
                <Image
                    source={
                    __DEV__
                        ? require('../assets/images/logo.png')
                        : require('../assets/images/logo.png')
                    }
                    style={styles.welcomeImage}
                />

                </View>

                <View style={styles.getStartedContainer}>
                {/* <DevelopmentModeNotice /> */}
                {/* ^ kanske ta tillbaka i framtiden, så man kan se om funkar i development mode/inte developmentmode */}

                {/* <Text style={styles.getStartedText}>Open up the code for this screen:</Text>

                <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                    <MonoText>screens/HomeScreen.js</MonoText>
                </View>

                <Text style={styles.getStartedText}>
                    Change any of the , save the file, and your app will automatically reload.
                </Text>
                </View> */}

                {/* <View style={styles.helpContainer}>
                <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
                    <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
                </TouchableOpacity>*/}
                <h2>Here's some stores in Stockholm</h2>
                {slice.map(store => <div>{store.address}</div>)}
                </View> 
            </ScrollView>

            <View style={styles.tabBarInfoContainer}>
                {/* <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text> */}
                {/* <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
                <MonoText style={styles.codeHighlightText}>navigation/BottomTabNavigator.js</MonoText>
                </View> */}
                <Text style={styles.tabBarInfoText}>Såhär funkar det:
                <ul>
                <li>Hitta närmsta systembolag</li>
                <li>Skaka din telefon! Shake it! shake it!</li>
                <li>A delicious beverage is recommended to you!</li>
                </ul>
                </Text> 
                <Button
                title="STARTA">
                </Button>
                <Image
                    source={
                    __DEV__
                        ? require('../assets/images/26711.jpg')
                        : require('../assets/images/26711.jpg')
                    }
                    style={styles.cheersImage}
                />
            </View>
            </View>
        )
    }
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 400,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  cheersImage: {
    width: 900,
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginBottom: 0,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  tabBarInfoText: {
    fontSize: 18,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'left',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
