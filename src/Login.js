import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import InstagramLogin from 'react-native-instagram-login';
import CookieManager from '@react-native-cookies/cookies';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';

export default function Login({navigation}) {
  const insRef = useRef();
  const [token, setToken] = useState(null);

  // const onClear = () => {
  //   CookieManager.clearAll(true)
  //     .then((res) => {
  //       setToken(null);
  //     });
  // };

  // useEffect(() => {
  //   CookieManager.get('https://www.instagram.com/accounts/login').then(
  //     cookies => {
  //       setcookies(cookies);
  //       console.log('CookieManager.get =>', cookies);
  //       // await AsyncStorage.setItem( 'csrftoken',cookies?.csrftoken?.value);
  //     },
  //   );
  // }, []);

  const setcookies = async cookies => {
    console.log('CookieManager.get =>', cookies);
    if (cookies?.sessionid) {
      console.log('CookieManager.get =>', cookies);
      await AsyncStorage.setItem('csrftoken', cookies?.csrftoken?.value);
      await AsyncStorage.setItem('ig_did', cookies?.ig_did?.value);
      await AsyncStorage.setItem('ig_nrcb', cookies?.ig_nrcb?.value);
      await AsyncStorage.setItem('datr', cookies?.datr?.value);
      await AsyncStorage.setItem('rur', cookies?.rur?.value);
      await AsyncStorage.setItem('mid', cookies?.mid?.value);
      await AsyncStorage.setItem('dpr', cookies?.dpr?.value);
      await AsyncStorage.setItem('ds_user_id', cookies?.ds_user_id?.value);
      await AsyncStorage.setItem('sessionid', cookies?.sessionid?.value);


      setTimeout(() => {
        // navigation.navigate('Home')
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Home'}],
          }),
        );
      }, 1000);
    } else {
    }
  };
  const onNavigationStateChange = event => {
    CookieManager.get('https://www.instagram.com/accounts/login').then(
      cookies => {
        if (cookies?.sessionid?.value) {
          setcookies(cookies);
        }
        // await AsyncStorage.setItem( 'csrftoken',cookies?.csrftoken?.value);
      },
    );

    // console.log("event",event)
    // if(event.canGoBack == true)
    // {
    //   console.log("canGoBack true")
    // }
  };
  return (
    <View style={{flex: 1}}>
      {/* <TouchableOpacity
        style={styles.btn}
        onPress={() => insRef.current.show()}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Login now</Text>
      </TouchableOpacity>
      */}
      {/* <Text style={{ margin: 10 }}>Token:{JSON.stringify(token)}   </Text> */}
      <WebView
        source={{uri: 'https://www.instagram.com/accounts/login'}}
        style={{flex: 1}}
        onNavigationStateChange={onNavigationStateChange}
      />
      {/* <InstagramLogin
        ref={insRef}
        appId='3396052627320011'
        appSecret='6531edd2877115f181639afe7a245fd8'
        redirectUrl='https://www.google.com/'
        scopes={['user_profile', 'user_media']}
        onLoginSuccess={(token) => onLoginSuccess(token)}
        onLoginFailure={(data) => console.log(data)}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 5,
    backgroundColor: 'orange',
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
//  'https://graph.instagram.com/7424450654237777?fields=id,media_type,media_url,username,timestamp&access_token=IGQWRNQTllUVlnZAlRSVWtoc3d4emtGZAmp5bzU1UVlDSTk2UlJTTmtFdXYxc0RTNlpwaU9RbGoza2xSZAEtaVEFIR3BIZAFZA4eDY4NGZAWWHpRaVNIaDBrZA05rdk94OUZALNlZABU3ZAmSmVZAaFI2YkoyUVBvWjR4cURRdWdrM1ZArdmhHXzdZAMzAZD'
