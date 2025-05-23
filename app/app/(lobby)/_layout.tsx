import { Tabs, Stack, useRouter } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { gameStarted, userJoined } from '@/store/slices/gameSlice';

export default function TabLayout() {
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  useAuth();

  useEffect(() => {
    const user_joined = (data:any) => {dispatch(userJoined(data))};
    const game_started = (data:any) => {
      console.log('Game started:', data);
      dispatch(gameStarted(data));
      router.replace('/(game)/(radar)/Radar');
    }
    
    socket?.on('user_joined', user_joined);
    socket?.on('game_started', game_started);
    return () => {
      socket?.off('user_joined', user_joined);
      socket?.off('game_started', game_started);
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1}} className='bg-bgc'>
      <Tabs>
        <Tabs.Screen name="(events)" options={{ headerShown: false }} />
        <Tabs.Screen name="(players)" options={{ headerShown: false }} />
        <Tabs.Screen name="(settings)" options={{ headerShown: false }} />
      </Tabs>
    </SafeAreaView>
  );
}
