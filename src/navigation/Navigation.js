import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Login';
import Home from '../Home';
import Videoplay from '../Videoplay';
import {DrawerNavigation} from './Drawer';
import { BottomTab } from './BottomTab';
import { Download } from '../Download';
const Stack = createNativeStackNavigator();
function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
         initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
     
        <Stack.Screen name="Home" component={DrawerNavigation} />
        <Stack.Screen name="Login" component={Login} />

        {/* <Stack.Screen name="Home" component={Home} /> */}

        <Stack.Screen name="Videoplay" component={Videoplay} />
        <Stack.Screen name="Download" component={Download} />

        
      </Stack.Navigator>
   
    </NavigationContainer>
  );
}

export default Navigation;
