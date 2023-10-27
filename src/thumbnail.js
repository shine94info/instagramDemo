// import React, { useEffect, useState } from 'react';
// import {
//   FlatList,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   RefreshControl,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNFetchBlob from 'rn-fetch-blob';
// import Iconshare from 'react-native-vector-icons/MaterialCommunityIcons';
// import Share from 'react-native-share';
// import RNMediaThumbnail from 'react-native-media-thumbnail';

// export const Download = ({ navigation }) => {
//   const [files, setFiles] = useState([]);
//   const [loader, setLoader] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     console.log('useeffectcallofdownload');
//     getdata();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     getdata();
//   };

//   const handleImageClick = item => {
//     navigation.navigate('Videoplay', { item: item });
//   };

//   const getdata = async () => {
//     const response = await AsyncStorage.getItem('sessionid');
//     console.log('response::::::', response);
//     if (response !== undefined && response !== null) {
//       setLoader(false);

//       const destinationPath =
//         RNFetchBlob.fs.dirs.DownloadDir + '/' + 'instagram';

//       await RNFetchBlob.fs.isDir(destinationPath).then(isDir => {
//         if (isDir == true) {
//           RNFetchBlob.fs.lstat(destinationPath).then(filesList => {
//             generateThumbnails(filesList); // Generate thumbnails for video files
//           });
//         }
//       });
//     } else {
//       setLoader(true);
//       navigation.navigate('Login');
//       setLoader(false);
//     }

//     setRefreshing(false);
//   };

//   const share = item => {
//     console.log('item:::', item);
//     try {
//       const options = {
//         message: 'insta',
//         title: 'instagram',
//         url: `file://${item.path}`,
//         type: 'video/mp4',
//       };

//       Share.open(options)
//         .then(res => {
//           console.log(res);
//         })
//         .catch(err => {
//           err && console.log(err);
//         });
//     } catch (error) {
//       console.error(error);
//     }
//   };

// //   const generateThumbnails = async (filesList) => {
// //     for (const item of filesList) {
// //       if (item.filename.endsWith('.mp4')) {
// //         const thumbnailOptions = {
// //           thumbnail: {
// //             export_uri: 'DESTINATION_FILE_PATH', // Specify the destination path
// //             export_type: 'jpg', // You can use 'jpg' or 'png'
// //             width: 200,
// //             height: 200,
// //           },
// //         };

// //         try {
// //           await RNMediaThumbnail.getMedia(item.path, thumbnailOptions, (params) => {
// //             // Do something with the thumbnail or the thumbnail URI
// //             console.log('Thumbnail URI:', params.thumbnail_uri);
// //             // You can also add the thumbnail URI to the item if needed
// //             item.thumbnailUri = params.thumbnail_uri;
// //             setFiles([...filesList]); // Update the state with the new item containing the thumbnail URI
// //           }, (e) => {
// //             console.log('Error: ', e);
// //           });
// //         } catch (err) {
// //           console.error(err);
// //         }
// //       }
// //     }
// //   };

//   function renderItem({ item, index }) {
//     console.log('Downloadtem>>>', item);
//     return (
//       <View
//         style={{
//           width: '50%',
//           padding: 10,
//           marginTop: 8,
//         }}>
//         <TouchableOpacity key={index} onPress={() => handleImageClick(item)}>
//           <Image
//             style={{
//               height: 180,
//               borderRadius: 20,
//             }}
//             source={{ uri: 'https://picsum.photos/200' }}
//           />
//           <View style={{ position: 'absolute', right: 10 }}>
//             <TouchableOpacity onPress={() => share(item)}>
//               <Iconshare
//                 name="share"
//                 color="white"
//                 size={26}
//                 style={{ backgroundColor: 'transparent' }}
//               />
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         style={{ width: '100%', marginBottom: 24 }}
//         data={files}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         keyExtractor={(item, index) => item.filename}
//         renderItem={renderItem}
//         numColumns={2}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 4,
//   },
//   ImageText: {
//     textAlign: 'center',
//     fontSize: 20,
//     color: 'black',
//     fontWeight: '700',
//   },
// });
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
import Options from 'react-native-vector-icons/SimpleLineIcons';
import Share from 'react-native-share';
import {createThumbnail} from 'react-native-create-thumbnail';
import {FFmpegKit, FFmpegKitConfig} from 'ffmpeg-kit-react-native';

export const Download = ({navigation}) => {
  const [files, setFiles] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('useeffectcallofdownload');
    getdata();
    generateThumbnail();
    // extractAudioFromVideo(
    //   item.path,
    //   '/storage/emulated/0/Download/instagram/`file://`.aac',
    // );
  }, []);

  const generateThumbnail = async () => {
    // if (!filepath) {
    //   return;
    // }
    const filepath =
      '/storage/emulated/0/Download/instagram/file_1697090231594.mp4';
    // setIsLoading(true);

    try {
      const response = await createThumbnail({
        url: `file://${filepath}`,
        timeStamp: 10000,
      });
      console.log('Response Thumb=====>', response);
      // setThumbnail(response.path);
    } catch (err) {
      console.error(err);
    } finally {
      // setIsLoading(false);
    }
  };

  // const extractAudioFromVideo = async (filepath, outputAudioPath) => {
  //   try {
  //     const session = FFmpegKit.execute(
  //       `-i ${filepath} -vn -acodec copy ${outputAudioPath}`,
  //     );

  //     await session.executeAsync();

  //     if (session.getState() === FFmpegKitConfig.SessionState.COMPLETED) {
  //       console.log('Audio extraction successful');
  //     } else {
  //       console.error(
  //         'Audio extraction failed:',
  //         session.getReturnCode(),
  //         session.getFailStackTrace(),
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error extracting audio:', error);
  //   }
  // };

  // ...

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
  //   return new Promise((resolve, reject) => {
  //     createThumbnail({
  //       url: `file://${item.path}`,
  //     })
  //       .then(thumbnailPath => {
  //         console.log('Generated Thumbnail Path:', thumbnailPath);
  //         resolve(thumbnailPath);
  //       })
  //       .catch(err => {
  //         console.log('Error generating thumbnail:', err);
  //         reject(err);
  //       });
  //   });
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

            filesList.forEach(async item => {
              const outputAudioPath = `${RNFetchBlob.fs.dirs.DownloadDir}/audio_${item.file}.aac`;
              await extractAudioFromVideo(item.path, outputAudioPath);
            });
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
    // genrateTumb(item)

    // console.log('Downloadtem>>>', item);

    const outputAudioPath = `/storage/emulated/0/Download/instagram/audio5.aac`;
    extractAudioFromVideo(item.path, outputAudioPath);
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
            // source={{uri: genrateTumb(item.path) || 'https://picsum.photos/200'}}
            source={{uri: 'https://picsum.photos/200'}}
            // source={{ uri: `file://${thumbnailPath}` }}
            //source={{ uri: generateThumbnail(item.path) }}
            
          ></Image>
           <View style={{ position: 'absolute' }}>
            <TouchableOpacity
              onPress={() => share(item)}
              style={{ right: 10, position: 'absolute' }}
            >
              <Iconshare name="share" color="white" size={26} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ right: 10, bottom: 10, position: 'absolute' }}
            >
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
