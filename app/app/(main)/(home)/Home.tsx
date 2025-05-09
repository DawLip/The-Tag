import { useSocket } from '@/socket/socket';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';

export default function HomeScreen() {
  const router = useRouter();
  const socket = useSocket();

  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    console.log('=== Home screen ===');
    console.log('token:', token);
    if(!socket){return;}

    socket.auth = { token: `Bearer ${token}` };
    socket?.connect();
    socket?.on('connect', () => {
      console.log('Socket connected');
    });
    socket?.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    socket?.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }, []);

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>THE TAG</Text>
      <View>
        <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>Join game by</Text>
        <View>
          <Button label="Game Code" onPress={()=>router.push('/(main)/(home)/JoinGameCode')}/>
          <Button label="QR Code" onPress={()=>router.push('/(main)/(home)/JoinQRCode')}/>
        </View>
      </View>
    </View>
  );
}

