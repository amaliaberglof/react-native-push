import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import FindScreen from '../screens/FindScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

import * as firebase from 'firebase/app';

import 'firebase/auth';




export default function BottomTabNavigator({ navigation, route,  }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  const [user, setUser] = useState(undefined)

  function handleStateChange(user) {
    if(user) {
      setUser(user.uid)
    }
    else {
      setUser(undefined)
    }

  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(handleStateChange)
  }, [user])

  console.log(user)
  // This us not current in use, since the header is hidden in App.js:
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={(props) => <HomeScreen {...props} user={user}/>}
        options={{
          unmountOnBlur: true,
          title: 'Get Started',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-beer" />,
        }}
      />
      <BottomTab.Screen
        name="Find"
        component={(props) => <FindScreen {...props} user={user}/>}
        options={{
          unmountOnBlur: true,
          title: 'Find drink',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
        }}
      />

      {user !== undefined && <BottomTab.Screen
        name="Links"
        component={(props) => <LinksScreen {...props} user={user}/>}
        options={{
          unmountOnBlur: true,
          title: 'Your profile',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
        }}
      />}

      {user === undefined && <BottomTab.Screen
        name="Links"
        component={(props) => <LinksScreen {...props} user={user}/>}
        options={{
          unmountOnBlur: true,
          title: 'Log in',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-log-in" />,
        }}
      />}
      

    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
    // This will not currently be shown, since the header is hidden in App.js:
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Find a drink!';
    case 'Links':
      return 'Links to learn more';
    case 'Find':
        return 'Hitta närmsta systembolag:';
  }
}
