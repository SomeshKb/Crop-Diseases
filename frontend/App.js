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
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
  console.log(disabled);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        {disabled ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={e => selectImage()}
              style={styles.button}>
              <FontistoIcon name="picture" color="white" />
              <Text style={styles.text}>Select Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={e => launchCamera()}
              style={styles.button}>
              <FontistoIcon name="camera" color="white" />
              <Text style={styles.text}>Launch Camera</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <ImageBackground
              source={{uri}}
              resizeMode="contain"
              style={styles.imageContainer}
            />

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={e => uploadImage()}
                style={styles.uploadButton}>
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.text}>Upload</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setImage({})}
                style={styles.uploadButton}>
                <Text style={styles.text}>Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    height: screenWidth / 2.2,
    width: screenWidth / 2.2,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    marginVertical: 10,
  },
  closeButton: {
    fontSize: 50,
    alignSelf: 'flex-end',
    marginHorizontal: 15,
  },
  uploadButton: {
    width: screenWidth / 2.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    margin: 5,
    borderRadius: 5,
  },
});

export default App;
