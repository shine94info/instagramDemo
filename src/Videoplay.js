import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import VideoPlayer from 'react-native-video-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';

const Videoplay = ({route}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const {item} = route.params;
  console.log('========>', item);

  const share = async () => {
    try {
      const options = {
        // message: 'insta',
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

  return (
    <View style={{flex: 1}}>
      <VideoPlayer
        // url = "data:<data_type>/<.mp4>;base64,<base64_data>"
        video={{uri: item.path}}
        videoWidth={windowWidth}
        videoHeight={windowHeight}
        autoplay={true}
      />
      <View style={{position: 'absolute', top: 600, right: 20}}>
        <TouchableOpacity onPress={share}>
          <Icon
            name="share"
            color="black"
            size={26}
            style={{backgroundColor: 'transparent'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Videoplay;
