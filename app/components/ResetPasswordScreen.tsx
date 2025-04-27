import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { validatePasswardStrength } from './Utils';

export const ResetPasswordScreen = () => {
  const [pass1, setPassword1] = useState('');
  const [pass2, setPassword2] = useState('');

  const handlePasswordReset = () => {
    const message = validatePasswardStrength(pass1);

    if (message) {
      Alert.alert('Błąd', message);
      return;
    }
    if(pass1 != pass2)
    {
      Alert.alert('Błąd', 'Passwards doesn\'t match');
      return;
    }
  
    Alert.alert('Sukces', `Hasło zresetowane`);
    //TODO: dalsze kroki do restartu hasła
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}

        placeholder=""
        keyboardType="default"
        autoCapitalize="none"
        value={pass1}
        onChangeText={setPassword1}
      />

      <Text style={styles.title}>Repete password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}

        placeholder=""
        keyboardType="default"
        autoCapitalize="none"
        value={pass2}
        onChangeText={setPassword2}
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>RESET PASSWORD</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 120,
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
