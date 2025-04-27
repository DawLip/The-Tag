import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { validateCode } from './Utils';

const backgroundImage = require('../assets/images/Topology.png');

export const JoinGameScreen = () => {
  const [code, setCode] = useState('');

  const handleJoiningGame = () => {
    const message = validateCode(code);

    if (message) {
      Alert.alert('Błąd', message);
      return;
    }
  
    //TODO: dalsze kroki do dołączenia do gry
  };

  return (
    <View style={styles.container}>

      <ImageBackground
        source={backgroundImage}
        style={styles.image}
        imageStyle={{ opacity: 0.3 }}  
        resizeMode="contain"
      >

        <TextInput
          style={styles.input}
          placeholder=""
          autoCapitalize="characters"
          keyboardType="ascii-capable"
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity style={styles.button} onPress={handleJoiningGame}>
          <Text style={styles.buttonText}>JOIN GAME</Text>
        </TouchableOpacity>

      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 90,
    backgroundColor: '#262626',
  },
  image: {
    width: 300,      // szerokość obrazka
    height: 300,     // wysokość obrazka
    paddingTop: 140,
    alignItems: 'center',
  },

  input: {
    height: 40,
    minWidth: 240,
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#D9D9D9',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,

    textAlign: 'center'
  },
  button: {
    alignSelf: 'center',    
    marginTop: 30,         
    justifyContent: 'center',
    backgroundColor: '#2C2C2C',
    width: 200,
    height: 80,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 40,
    
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    // Android shadow
    elevation: 8,
  },
  buttonText: {
    //font: 'Aboreto',
    fontSize: 15,
    letterSpacing: -0.23,
    
    color: '#fff',
    textAlign: 'center',
  },
});
