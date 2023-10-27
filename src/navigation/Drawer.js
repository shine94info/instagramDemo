import {createDrawerNavigator} from '@react-navigation/drawer';
import {Settings} from 'react-native';
import Home from '../Home';
import {BottomTab} from './BottomTab';
import {Collection} from '../Drawer/Collection';
import {Logout} from '../Drawer/Logout';
import {Setting} from '../Drawer/Setting';
import {Howtodownload} from '../Drawer/Howtodownload';
import {BottomTabBar} from '@react-navigation/bottom-tabs';
const Drawer = createDrawerNavigator();

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={() => ({
        headerShown: true,
      })}>
      {/* <Drawer.Screen name="Home" component={Home} /> */}
      <Drawer.Screen name="Instagram" component={BottomTab} />
      <Drawer.Screen name="Collection" component={Collection} />
      <Drawer.Screen name="Howtodownload" component={Howtodownload} />
      <Drawer.Screen name="Logout" component={Logout} />
      <Drawer.Screen name="Setting" component={Setting} />

      {/* <Drawer.Screen name="" component={Collection} /> */}
    </Drawer.Navigator>
  );
};
