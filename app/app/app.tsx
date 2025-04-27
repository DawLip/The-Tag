import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

import {JoinGameScreen} from '../components/JoinGameScreen';
import {RadarScreen} from '../components/RadarScreen';

// <JoinGameScreen />
// { latitude: 50.2660, longitude: 18.9450 },   
// { latitude: 50.2300, longitude: 18.9850 },
// { latitude: 50.1950, longitude: 18.9450 },
// { latitude: 50.2300, longitude: 18.9050 }
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      
      <RadarScreen players={[
        { latitude: 50.2304593, longitude: 18.9459344 }  
      ]} /> 
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
