import 'react-native-gesture-handler';
import React from 'react';
import Navigation from './src/navigation/Navigation';
import {BottomTab} from './src/navigation/BottomTab';
import {NavigationContainer} from '@react-navigation/native';
import {DrawerNavigation} from './src/navigation/Drawer';
import Scan from './src/scan/scan';
const App = () => {
    return <Navigation />;
  // return <Scan/>
};                     
export default App;
                                                       