import { useRouter } from 'expo-router';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '@/store/thunks/auth/loginThunk';
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
  const [password, setPassowrd] = useState('');

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
          label='Password'
          value={password}
          placeholder=''
          setValue={setPassowrd}
          isPassword={true}
        />
      </View>
      <Text>{error}</Text>
      <View>
        <Button label='LOG IN' onPress={()=>dispatch(loginThunk({ email, password }))}/>
        <Button label='Create account' variant="OUTLINE-WHITE" onPress={()=>router.push('/(auth)/ForgotPassword')}/>
      </View>
    </View>
  );
}