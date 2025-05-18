import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { useSocket } from '@/socket/socket';

import { useDispatch, useSelector } from 'react-redux';
import { joinLobby } from '@/store/slices/gameSlice';
import type { AppDispatch } from '@store/index';

import Button from '@c/Button';
import TextInput from '@c/inputs/TextInput';

import Logo from '@img/Logo.svg';
import { useState } from 'react';

export default function CreateScreen() {
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>('');

  const createGame = () => {
    console.log('=== Create lobby ===');
    socket?.emit('create_lobby', {name}, (response: any) => {
      if (response.status !== 'SUCCESS') console.error('Error creating lobby:', response.status,response.message);
      console.log('Lobby created successfully:', response);
      
      dispatch(joinLobby(response.game));
      router.push('/(lobby)/(players)/Players');
    });
  }

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>New Lobby</Text>
      <View>
        <TextInput
          label='Lobby name'
          placeholder='Enter lobby name'
          value={name}
          setValue={setName}
        />
      </View>
      <View>
        <Button label='Create Game' onPress={createGame}/>
      </View>
    </View>
  );
}

