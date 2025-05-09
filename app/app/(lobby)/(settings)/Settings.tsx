import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';
import { useSocket } from '@/socket/socket';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { gameStarted } from '@/store/slices/gameSlice';

export default function LobbySettingsScreen() {
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  const gameCode = useSelector((state: any) => state.game.gameCode);
  console.log("gamecode", gameCode);
  const handleStartGame = () => {
    console.log('=== Start game ===');
    socket?.emit('start_game', {gameCode}, (response: any) => {console.log('Game started successfully:', response);})
    dispatch(gameStarted({}));
    router.replace('/(game)/(radar)/Radar');
  }

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>Settings</Text>
      <Button label="Start game" onPress={handleStartGame}/>
    </View>
  );
}

