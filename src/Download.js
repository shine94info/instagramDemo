import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Iconshare from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';
import {createThumbnail} from 'react-native-create-thumbnail';
import { FFmpegKit, FFmpegKitConfig } from 'ffmpeg-kit-react-native';

import Options from 'react-native-vector-icons/SimpleLineIcons';

export const Download = ({navigation}) => {
  const [files, setFiles] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const outputAudioPath = `${RNFetchBlob.fs.dirs.DownloadDir}/audio.aac`;

  useEffect(() => {
    console.log('useeffectcallofdownload');
    getdata();
  }, []);

  // const genrateTumb = (item) =>
  // {
  //   createThumbnail({
  //     url: `file://${item.path}`,
  //     timeStamp: 10000,
  //   })
  //     .then(response => console.log({ response }))
  //     .catch(err => console.log({ err }));
  // }
  const genrateTumb = item => {
    return new Promise((resolve, reject) => {
      createThumbnail({
        url: `file://${item.path}`,
      })
        .then(response => {
          resolve(response);
          console.log('thumbnailresponse', response);
        })
        .catch(err => {
          console.log('Error generating thumbnail:', err);
          reject(err);
        });
    });
  };

  
  const extractAudioFromVideo = async (filepath, outputAudioPath) => {
    console.log('filepathextract', filepath);
    try {
      const result = await FFmpegKit.executeAsync(
        `-i ${filepath} -vn -acodec copy ${outputAudioPath}`,
      );
      console.log('resultresult', result);

      if (result.getState() === FFmpegKitConfig.SessionState.COMPLETED) {
        console.log('Audio extraction successful');
      } else {
        console.error(
          'Audio extraction failed:',
          result.getReturnCode(),
          result.getFailStackTrace(),
        );
      }
    } catch (error) {
      console.error('Error extracting audio:', error);
    }
  };


  // const genrateTumb = (item) => {
  //   try {
  //     const thumbnailPath = createThumbnail({
  //       url: `file://${item.path}`,
  //       timeStamp: 10000,
  //     });
  //     console.log('Thumbnail Path:', thumbnailPath);
  //     return thumbnailPath;
  //   } catch (err) {
  //     console.log('Error generating thumbnail:', err);
  //     return null;
  //   }
  // }

  const onRefresh = () => {
    setRefreshing(true);
    getdata();
  };

  const handleImageClick = item => {
    navigation.navigate('Videoplay', {item: item});
  };

  const getdata = async () => {
    const response = await AsyncStorage.getItem('sessionid');
    console.log('response::::::', response);
    if (response !== undefined && response !== null) {
      setLoader(false);

      const destinationPath =
        RNFetchBlob.fs.dirs.DownloadDir + '/' + 'instagram';

      await RNFetchBlob.fs.isDir(destinationPath).then(isDir => {
        if (isDir == true) {
          RNFetchBlob.fs.lstat(destinationPath).then(filesList => {
            setFiles(filesList);
          });
        }
      });
    } else {
      setLoader(true);
      navigation.navigate('Login');
      setLoader(false);
    }

    setRefreshing(false);
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

  function renderItem({item, index}) {
 //   const thumbnailPath = genrateTumb(item);

    console.log('Downloadtem>>>', item);
    return (
      <View
        style={{
          // flex: 1,
          width: '50%',
          padding: 10,
          marginTop: 8,
        }}>
        <TouchableOpacity key={index} onPress={() => handleImageClick(item)}>
          <Image
            style={{
              height: 180,
              borderRadius: 20,
            }}
            //source={{uri: genrateTumb(item.path) || 'https://picsum.photos/200'}}
            source={{uri: 'https://picsum.photos/200'}}
            //source={{ uri: `file://${thumbnailPath}` }}
          ></Image>

          <View style={{position: 'absolute', right: 10}}>
            <TouchableOpacity
              onPress={() => share(item)}
              style={{right: 10, position: 'absolute'}}>
              <Iconshare name="share" color="black" size={26} />
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{right: 10, bottom: 10, position: 'absolute'}}>
              <Options name="options-vertical" color="white" size={26} />
            </TouchableOpacity> */}
             <TouchableOpacity
              onPress={() => {
                // Add this line to extract audio when the options button is pressed
                extractAudioFromVideo(item.path, outputAudioPath);
              }}
              style={{

                top:140
              }}>
              <Options name="options-vertical" color="white" size={26} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        style={{width: '100%', marginBottom: 24}}
        data={files}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item, index) => item.filename}
        renderItem={renderItem}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  ImageText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
  },
});
