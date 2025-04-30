import { useRouter } from 'expo-router';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { registerThunk } from '@/store/thunks/auth/registerThunk';
import { setError } from '@/store/slices/authSlice';
import type { AppDispatch } from '@store/index';

import Button from '@c/Button';
import TextInput from '@c/inputs/TextInput';

export default function LoginScreen() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state:any) => state.auth.token);
  const error = useSelector((state:any) => state.auth.error);

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassowrd] = useState('');
  const [rPassword, setRPassowrd] = useState('');

  useEffect(()=>{dispatch(setError(''))}, []);

  return (
    <View className='flex-1 bg-bgc'>
      <View>
        <TextInput 
          label='Email'
          value={email}
          placeholder='Your email'
          setValue={setEmail}
        />
        <TextInput 
          label='Nickname'
          value={nickname}
          placeholder='Your nickname'
          setValue={setNickname}
        />
        <TextInput 
          label='Password'
          value={password}
          placeholder=''
          setValue={setPassowrd}
          isPassword={true}
        />
        <TextInput 
          label='Repeat password'
          value={rPassword}
          placeholder=''
          setValue={setRPassowrd}
          isPassword={true}
        />
      </View>
      <Text>{error}</Text>
      <View>
        <Button label='Register' onPress={()=>dispatch(registerThunk({ email, nickname, password, rPassword }))}/>
      </View>
    </View>
  );
}