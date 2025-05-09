import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { useSocket } from '@/socket/socket';

import { useDispatch, useSelector } from 'react-redux';
import { joinLobby } from '@/store/slices/gameSlice';
import type { AppDispatch } from '@store/index';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';

export default function CreateScreen() {
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  const createGame = () => {
    console.log('=== Create lobby ===');
    socket?.emit('create_lobby', {}, (response: any) => {
      if (response.status !== 'SUCCESS') console.error('Error creating lobby:', response.status,response.message);
      console.log('Lobby created successfully:', response);
      
      dispatch(joinLobby(response.game));
      router.push('/(lobby)/(players)/Players');
    });
  }

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>THE TAG</Text>
      <View>
        <Button label='Create Game' onPress={createGame}/>
      </View>
    </View>
  );
}

