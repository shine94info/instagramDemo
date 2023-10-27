import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import Toast from 'react-native-simple-toast';
import {SkypeIndicator} from 'react-native-indicators';
import Icon from 'react-native-vector-icons/AntDesign';
import Iconshare from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  TextInput,
  Pressable,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

import Clipboard from '@react-native-clipboard/clipboard';
import Login from './Login';
import {CommonActions} from '@react-navigation/native';
import CookieManager from '@react-native-cookies/cookies';
const Home = () => {
  const player = useRef(null);
  const navigation = useNavigation();

  const [copiedURL, setCopiedURL] = useState('');
  const [files, setFiles] = useState([]);
  const [replacedsplitURL, setreplacedsplitURL] = useState(null);
  const [loader, setLoader] = useState(true);
  const [loginbtn, setLoginbtn] = useState(false);
  const [logOutbtn, setLogoutbtn] = useState(false);

  useEffect(() => {
    console.log('useeffectcall');
    getdata();
    
  }, []);

  const pasteLink = async () => {
    const text = await Clipboard.getString();
    console.log(text);
    var splitURL = text.toString().split('?');
    var replacedsplitURL = splitURL[0] + '?__a=1&__d=dis';
    console.log('replacedsplitURL', replacedsplitURL);
    setreplacedsplitURL(replacedsplitURL);

    if (text == null && text === undefined) {
      Toast.show('url not detected');
    } else if (text.startsWith('https://www.instagram.com')) {
      setCopiedURL(text);
    } else {
      Toast.show('not valid url');
    }
  };

  const getdata = async () => {
    const response = await AsyncStorage.getItem('sessionid');
    console.log('response::::::', response);
    try {
      if (Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,

          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        } else {
        }
      }
    } catch (err) {}
    if (response !== undefined && response !== null) {
      setLoader(false);
      // apicall();

      const destinationPath =
        RNFetchBlob.fs.dirs.DownloadDir + '/' + 'instagram';

      await RNFetchBlob.fs.isDir(destinationPath).then(isDir => {
        console.log('isDir ==>', isDir);
        if (isDir == true) {
          RNFetchBlob.fs.lstat(destinationPath).then(filesList => {
            console.log('====>', filesList);
            setFiles(filesList);
          });
        }
      });
    } else {
      setLoader(true);
      navigation.navigate('Login');
      setLoader(false);
    }
  };
  const getdata1 = async replacedsplitURL => {
    const response = await AsyncStorage.getItem('sessionid');

    if (response !== undefined && response !== null) {
      apicall(replacedsplitURL);
    }
    // else {
    //   navigation.navigate('Login');
    // }
  };

  const apicall = async replacedsplitURL => {
    var myHeaders = new Headers();
    const csrftoken = await AsyncStorage.getItem('csrftoken');
    const ig_did = await AsyncStorage.getItem('ig_did');
    const ig_nrcb = await AsyncStorage.getItem('ig_nrcb');
    const datr = await AsyncStorage.getItem('datr');
    const mid = await AsyncStorage.getItem('mid');
    const rur = await AsyncStorage.getItem('rur');
    const dpr = await AsyncStorage.getItem('dpr');
    const ds_user_id = await AsyncStorage.getItem('ds_user_id');
    const sessionid = await AsyncStorage.getItem('sessionid');

    myHeaders.append(
      'cookie',
      'ig_did=' +
        ig_did +
        ';ig_nrcb=' +
        ig_nrcb +
        ';datr=' +
        datr +
        ';mid=' +
        mid +
        ';csrftoken=' +
        csrftoken +
        ';' +
        'rur=' +
        rur +
        ';' +
        'ds_user_id=' +
        ds_user_id +
        ';' +
        'sessionid=' +
        sessionid,
    );
    console.log('myHeaders', myHeaders);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(replacedsplitURL, requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log("result",result)
        const test = JSON.parse(result);
        console.log('video_versions', test?.graphql);
        if ('graphql' in test) {
          setLoginbtn(true);
          Toast.show('please login');
          // AsyncStorage.clear();

          setLoader(false);
        } else {
          if ('video_versions' in test?.items[0]) {
            console.log('check key');
            getDataUsingGet(test?.items[0]?.video_versions[0]?.url);
          } else {
            setLoader(false);
          }
        }
        // getDataUsingGet(test?.items[0]?.video_versions[0]?.url);
        // videourl('https://shorturl.at/kCNRY');
      })
      .catch(error => {
        // AsyncStorage.clear();
        Toast.show('please login');
        setLoader(true);
        console.log('error11111', error);
        CookieManager.clearAll().then(success => {
          console.log('CookieManager.clearAll =>', success);
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Login'}],
            }),
          );
        });
      });
  };
  const getDataUsingGet = url => {
    fetch('https://tinyurl.com/api-create.php?url=' + url, {
      method: 'GET',
    })
      .then(response => response.text())
      .then(responseJson => {
        console.log(responseJson);
        videourl(responseJson);
      })
      .catch(error => {
        setLoader(false);

        console.error(error);
      });
  };
  const videourl = async url => {
    if (Platform.OS === 'ios') {
      downloadFile(url);
    } else {
      try {
        if (Platform.Version < 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

            {
              title: 'Storage Permission Required',
              message:
                'Application needs access to your storage to download File',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            downloadFile(url);
            console.log('Storage Permission Granted.');
          } else {
            Toast.show('Storage Permission Not Granted');
          }
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,

            {
              title: 'Storage Permission Required',
              message:
                'Application needs access to your storage to download File',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            downloadFile(url);
            console.log('Storage Permission Granted.');
          } else {
            Alert.alert('Error', 'Storage Permission Not Granted');
          }
        }
      } catch (err) {
        setLoader(false);
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };
  const downloadFile = async (fileUrl, replacedsplitURL) => {
    const destinationPath = RNFetchBlob.fs.dirs.DownloadDir + '/' + 'instagram';

    await RNFetchBlob.fs.isDir(destinationPath).then(isDir => {
      console.log('isDir', isDir);
      if (isDir == true) {
        downloadvideo(fileUrl, destinationPath);
        // RNFetchBlob.fs.lstat(destinationPath).then(filesList => {

        // });
      } else {
        // destinationPath =RNFetchBlob.fs.dirs.DownloadDir + '/' + 'instagram';
        const instagram = RNFetchBlob.fs.dirs.DownloadDir + '/instagram';
        RNFetchBlob.fs.mkdir(instagram).catch(err => {
          console.log(err);
        });
      }
    });
  };
  const downloadvideo = async (fileUrl, destinationPath) => {
    let fileName = Date.now();
    let fileExtention = '.mp4';
    let fileFullName = fileName;

    // let file_ext = getFileExtention(fileExtention);

    // file_ext = '.' + file_ext[0];

    const {config, fs} = RNFetchBlob;
    let path = destinationPath;
    console.log('path', path);
    // let RootDir = fs.dirs.PictureDir;
    let ext = '.mp4';
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: path + '/file_' + fileFullName + ext,
        description: 'downloading file...',
        notification: true,
        useDownloadManager: true,
        mime: 'video/mp4',
      },
    };
    config(options)
      .fetch('GET', fileUrl)
      .then(async res => {
        console.log('res -> ', console.log('res', res), JSON.stringify(res));
        // Alert.alert('File Downloaded Successfully.');
        Toast.show('File Downloaded Successfully.');

        const destinationPath =
          RNFetchBlob.fs.dirs.DownloadDir + '/' + 'instagram';

        await RNFetchBlob.fs.isDir(destinationPath).then(isDir => {
          console.log('isDir ==>', isDir);
          if (isDir == true) {
            RNFetchBlob.fs.lstat(destinationPath).then(filesList => {
              console.log('====>', filesList);
              setFiles(filesList);
            });
          }
        });
        setLoader(false);
      });
  };
  const share = item => {
    console.log('item:::', item);
    try {
      const options = {
        message: 'insta',
        title: 'instagram',
        url: `file://${item.path}`,
        type: 'video/mp4',
      };

      Share.open(options)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const datadowload = () => {
    if (
      replacedsplitURL !== null &&
      replacedsplitURL !== undefined &&
      replacedsplitURL !== ' '
    ) {
      getdata1(replacedsplitURL);
      setLoader(true);
    } else {
      setLoader(false);

      Toast.show('no url found');
    }
  };


  const handleImageClick = item => {
    navigation.navigate('Videoplay', {item: item});
    // navigation.navigate('Download', {item: item});
  };

  function renderItem({item, index}) {
    console.log('tem>>>', item);
    return (
      <View
        style={{
          // flex: 1,
          width: '50%',
          padding: 10,
          marginTop: 20,
        }}>
        <TouchableOpacity key={index} onPress={() => handleImageClick(item)}>
          <Image
            style={{
              height: 180,
              borderRadius: 20,
            }}
            // source={{uri: item.path}}
            source={{uri: 'https://picsum.photos/200'}}></Image>
          <View style={{position: 'absolute', right: 10}}>
            <TouchableOpacity onPress={() => share(item)}>
              <Iconshare
                name="share"
                color="black"
                size={26}
                style={{backgroundColor: 'transparent'}}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  const loginButtonClick = () => {
    navigation.navigate('Login');
  };

  const logoutbtn = async () => {
    // console.log('logoutconfirm');
    try {
      console.log('logoutconfirm');

      // await AsyncStorage.clear();
      CookieManager.clearAll().then(success => {
        console.log('CookieManager.clearAll =>', success);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Login'}],
          }),
        );
      });
      navigation.navigate('Login');
    } catch (err) {
      console.log('logout err', err);
    }
  };

  return (
    <View style={styles.container}>
      {loader == false ? (
        <>
          {loginbtn == true ? (
            <TouchableOpacity
              style={{alignItems: 'flex-end', paddingEnd: 20, marginBottom: 16}}
              onPress={loginButtonClick}>
              <Icon name="login" size={26} color="blue" />
            </TouchableOpacity>
          ) : // <TouchableOpacity
          //   style={{alignItems: 'flex-end', paddingEnd: 20, marginBottom: 16}}
          //   onPress={loginButtonClick}>
          //   <Icon
          //     name="logout"
          //     size={26}
          //     color="black"
          //     onPress={() => {
          //       logoutbtn();
          //     }}
          //   />
          // </TouchableOpacity>
          null}

          <View style={styles.cardview}>
            <View style={styles.textinputview}>
              <TextInput
                placeholder="Enter/paste file URL"
                style={styles.videodownloadtextinput}
                value={copiedURL}
                onChangeText={setCopiedURL}></TextInput>
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => setCopiedURL('')}>
                <Iconshare name="close" color="black" size={26} />
              </TouchableOpacity>
            </View>

            <View style={styles.btnview}>
              <TouchableOpacity
                style={styles.button}
                // onPress={() => pasteLink()}
                onPress={pasteLink}>
                <Text style={styles.buttonText}>Paste Link</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  datadowload();
                }}>
                <Text style={styles.buttonText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <FlatList
            style={{width: '100%'}}
            data={files}
            keyExtractor={(item, index) => item.filename}
            renderItem={renderItem}
            numColumns={2}
          /> */}

          <Modal transparent visible={loader}>
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}>
              <SkypeIndicator size={50} color={'red'} />
            </View>
          </Modal>
        </>
      ) : (
        <Modal transparent visible={loader}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
            <SkypeIndicator size={50} color={'red'} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: 10,
  },
  cardview: {
    backgroundColor: 'white',
    width: '95%',
    marginHorizontal: 10,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-evenly',
  },
  textinputview: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    height: 60,
    borderWidth: 2,
    justifyContent: 'center',
    borderColor: 'blue',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  button: {
    height: 50,
    backgroundColor: '#CBC3E3',
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    textAlign: 'center',
    fontWeight: '900',
  },
  videodownloadtextinput: {
    width: '90%',
    // height: 60,
    // borderWidth: 2,
    // alignSelf: 'center',
    // borderColor: 'blue',
    // borderRadius: 20,
    // paddingHorizontal: 10,
  },
  btnview: {
    flexDirection: 'row',
  },
  downloadbtn: {
    height: 60,
    borderRadius: 20,
    flex: 1,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
