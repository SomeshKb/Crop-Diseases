/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import CameraPicker from 'react-native-image-picker';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  ImageBackground,
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

const App = () => {
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const selectImage = async () => {
    try {
      const {
        data: uri,
        cropRect: {height, width},
        path,
      } = await ImagePicker.openPicker({
        cropping: true,
        includeBase64: true,
      });

      const imageObj = {uri, height, width, path};

      setImage(imageObj);
    } catch (e) {
      console.log(e);
    }
  };
  const uploadImage = async () => {
    try {
      const url = 'http://127.0.0.1:5000/api/upload';
      setLoading(true);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({image: image.uri}),
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    CameraPicker.launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const {uri, width, height} = response;
        const imageObj = {uri, width, height};
        console.log('response', JSON.stringify(response));
        setImage(imageObj);
      }
    });
  };

  const uri = Object.keys(image).length
    ? image.path || image.uri
    : 'https://via.placeholder.com/200';
  const disabled = !Object.keys(image).length;
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView>
          <ImageBackground
            source={{uri}}
            resizeMode="contain"
            style={styles.imageContainer}>
            <TouchableOpacity onPress={() => setImage({})}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </ImageBackground>
          <TouchableOpacity onPress={e => selectImage()} style={styles.button}>
            <Text style={styles.text}>Select Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={e => launchCamera()} style={styles.button}>
            <Text style={styles.text}>Launch Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => uploadImage()}
            style={{
              ...styles.button,
              ...(disabled && {backgroundColor: '#d3d3d3'}),
            }}
            disabled={disabled}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.text}>Upload</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: screenWidth,
    height: screenWidth,
    backgroundColor: '#d3d3d3',
  },
  button: {
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'blue',
    height: 50,
  },
  text: {
    color: 'white',
  },
  closeButton: {
    fontSize: 50,
    alignSelf: 'flex-end',
    marginHorizontal: 15,
  },
});

export default App;
