import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Button = ({label, variant="DEFAULT", onPress}:{label:string, variant?: string, onPress:()=>void}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <Text className='text-on_bgc'>{label}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Button;