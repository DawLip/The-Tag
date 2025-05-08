import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'DEFAULT';
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({ label, onPress, style, textStyle }: ButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
        <Text style={[styles.text, textStyle]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    width: 297,
    height: 80,
    backgroundColor: '#343437',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 40,
  },
  text: {
    fontFamily: 'Aboreto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.23,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default Button;
