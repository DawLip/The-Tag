import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { validateEmail } from './Utils';

export const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    const message = validateEmail(email);

    if (message) {
      Alert.alert('Błąd', message);
      return;
    }
  
    Alert.alert('Sukces', `Link do resetu hasła został wysłany na ${email}`);
    //TODO: dalsze kroki do restartu hasła
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write Email</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>SEND EMAIL</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 200,
    backgroundColor: '#262626',
  },
  title: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
    textAlign: 'left',
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
  },
  button: {
    alignSelf: 'center',    
    marginTop: 10,         
    justifyContent: 'center',
    backgroundColor: '#7676801F',
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
