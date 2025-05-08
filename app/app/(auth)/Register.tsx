import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { registerThunk } from '@/store/thunks/auth/registerThunk';
import { setError } from '@/store/slices/authSlice';
import type { AppDispatch } from '@store/index';

import Button from '@c/Button';
import TextInput from '@c/inputs/TextInput';

import Background from '@c/Background';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: any) => state.auth.token);
  const error = useSelector((state: any) => state.auth.error);

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [rPassword, setRPassword] = useState('');

  useEffect(() => {
    dispatch(setError(''));
  }, []);

  const handleRegister = () => {
    if (password !== rPassword) {
      dispatch(setError('Passwords do not match.'));
      return;
    }
    dispatch(registerThunk({ email, nickname, password, rPassword }));
  };

    return (
      <View style={styles.container}>
        <Background /> {/* ← tło pod wszystkimi elementami */}
    
        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            placeholder="Your email"
            setValue={setEmail}
          />
          <TextInput
            label="Nickname"
            value={nickname}
            placeholder="Your nickname"
            setValue={setNickname}
          />
          <TextInput
            label="Password"
            value={password}
            placeholder="Password"
            setValue={setPassword}
            isPassword
          />
          <TextInput
            label="Repeat password"
            value={rPassword}
            placeholder="Repeat password"
            setValue={setRPassword}
            isPassword
            style={{ marginTop: 24 }}
          />
        </View>
    
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
    
        <View style={styles.buttonWrapper}>
          <Button
            label="Register"
            onPress={handleRegister}
            textStyle={{ fontSize: 18 }}
          />
        </View>
      </View>
    );
    
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  form: {
    width: 297,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 16,
    marginBottom: 8,
  },
  buttonWrapper: {
    width: 297,
    marginTop: 24,
  },
});
