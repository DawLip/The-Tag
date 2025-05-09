import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useDispatch } from 'react-redux';
import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';

import TextInput from '@c/inputs/TextInput'

import Button from '@c/Button';
import { joinLobby } from '@/store/slices/gameSlice';

export default function JoinGameCodeScreen() {
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();


  const [gameCode, setGameCode] = useState("");

  const handleJoinLobby=()=>{
    console.log('=== Join lobby ===');
    socket?.emit('join_lobby', { gameCode }, (response: any) => {
      if (response.status !== 'SUCCESS') console.error('Error joining lobby:', response.status,response.message);
      console.log('Joined successfully:', response);
      
      dispatch(joinLobby(response.game));
      router.push('/(lobby)/(players)/Players');
    });
    router.replace('/(lobby)/(players)/Players')
  }

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>THE TAG</Text>
      <View>
        <TextInput label='Game code' placeholder='Enter Game Code' value={gameCode} setValue={setGameCode}/>
        <Button label='Join Now' onPress={handleJoinLobby}/>
      </View>
    </View>
  );
}

