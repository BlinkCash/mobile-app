import React from 'react';
import {
  AsyncStorage,
  ImageBackground,
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
// import { verticalScale, scale } from '../../utils/constants/Layout';
// import axiosSetup from '../../axios';

const ACCESS_TOKEN = 'access_token';

export default function AuthLoadingScreen () {
  // axiosSetup()
  // Fetch the token from storage then navigate to our appropriate place
  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/splash.png')} style={styles.image}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold"
  }
});