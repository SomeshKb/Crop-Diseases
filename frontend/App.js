/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  ImageBackground,
  Dimensions,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const App = () => {
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        includeBase64: true,
      });

      console.log(image);

      setImage(image);
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
        body: JSON.stringify({image: image.data}),
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const uri = Object.keys(image).length
    ? image.path
    : 'https://via.placeholder.com/200';
  const height = (image && image.cropRect && image.cropRect.height) || 300;
  const imageStyle = {...styles.imageContainer, height};
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={imageStyle}>
          <ImageBackground source={{uri}} style={styles.imageStyle}>
            <TouchableOpacity onPress={() => setImage({})}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
        <TouchableOpacity onPress={e => selectImage()} style={styles.button}>
          <Text style={styles.text}>Select Image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={e => uploadImage()} style={styles.button}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.text}>Upload</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
  },
  imageStyle: {
    width: width,
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
    color: 'white',
    fontSize: 50,
    alignSelf: 'flex-end',
    marginHorizontal: 15,
  },
});

export default App;
