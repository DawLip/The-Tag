import React from 'react';
import { StyleSheet, View } from 'react-native';
import Logo2 from '@img/Logo2.svg';

const Background = () => {
  return (
    <View style={styles.background}>
      <View style={styles.logo}>
         <Logo2/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject, 
    zIndex: 0,
    gap: 10,
    backgroundColor: '#262626',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width:361,
    height:366.6,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Background;
