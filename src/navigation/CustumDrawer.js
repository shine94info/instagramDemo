import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

export const Customdrawer = ({props, navigation}) => {
  return (
    <View style={{paddingTop: 140, backgroundColor: '#FA4A0C', flex: 1}}>
      <DrawerItem
        label="Collection"
        labelStyle={{fontSize: 17}}
        icon={({color, size}) => (
          <Icon name="home-outline" size={30} color={'white'} />
        )}
        onPress={() => {
          props.navigation.navigate('Collection');
        }}
      />

      <View
        style={{
          borderColor: 'white',
          borderWidth: 0.2,
          marginTop: 10,
          marginBottom: 10,
        }}
      />
      <DrawerItem
        label="Howtodownload"
        labelStyle={{fontSize: 17}}
        icon={({color, size}) => (
          <Icon name="heart-outline" size={30} color={'white'} />
        )}
        onPress={() => {
          props.navigation.navigate('Howtodownload');
          activeBackgroundColor = 'blue';
        }}
      />
      <View
        style={{
          borderColor: 'white',
          borderWidth: 0.2,
          marginTop: 10,
          marginBottom: 10,
        }}
      />

      <DrawerItem
        label="Logout"
        labelStyle={{fontSize: 17}}
        icon={({color, size}) => (
          <Icon name="person-outline" size={30} color={'white'} />
        )}
        onPress={() => {
          props.navigation.navigate('Logout');
        }}
      />
      <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 40}}>
      
    </View>
    <View>

    </View>
    </View>
  );
};
