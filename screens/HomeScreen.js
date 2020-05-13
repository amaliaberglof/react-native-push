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
                  
                  <Text style={styles.infoText}>En trevlig text som förklarar vår app :))</Text>
                  {/* <Text style={styles.infoText}>Looking for a drink to buy?</Text>
                  <Text style={styles.centerText}>First of all, let us find the closest Systembolag with an inventory for you. Then we will suggest a drink within that inventory. 
                    <br/>
                    <br/>Want another drink? Just spin your phone 360° and we will provide you with a new suggestion. 
                    <br/>
                    <br/>Don't forget to save your favorite drinks to your profile! 
                    </Text>
                  <Text style={styles.infoText}><br/>Ready?<br/></Text> */}

                  <Button onPress={() => 
                    {this.props.navigation.navigate('Find')
                    }}
                    title="FIND ME A DRINK">
                  </Button>

                  {/* <Text style={styles.helpLinkText}
                   onPress={() =>this.props.navigation.navigate('Links')}>
                    {this.props.user === undefined? <div>Or <u>sign in</u> to see your saved suggestions</div>:
                    <u>Show my profile</u>}
                  </Text> */}
                  <Image source={require('../assets/images/frontpageimg.png')} style={styles.bottomImage}/>

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
  logoImage: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginBottom: 0,
    marginLeft: -10,
  },
  bottomImage: {
    width: 500,
    height: 200,
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
    textAlign: 'left',
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
