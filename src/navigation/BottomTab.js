import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Home';
import Login from '../Login';
import AntDesign from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import Navigation from './Navigation';
import Videoplay from '../Videoplay';
import {downloadFile} from 'react-native-fs';
import {Download} from '../Download';

const Tab = createBottomTabNavigator();

export const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route, item}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'Home') {
            return (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Download') {
            return (
              <Icon
                name={focused ? 'download' : 'download-outline'}
                size={size}
                color={color}
              />
            );
          }
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      {/* <Tab.Screen name="Videoplay" component={Videoplay} /> */}
      <Tab.Screen name="Download" component={Download} />
    </Tab.Navigator>
  );
};
