import React from 'react';
import { StyleSheet, View } from 'react-native';
import Logo2 from '@img/Logo2.svg';

const Background = () => {
  return (
    <View style={styles.background}>
      <Logo2 width="100%" height="100%" />
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject, 
    zIndex: 0,
    margin: 10,
  },
});

export default Background;
