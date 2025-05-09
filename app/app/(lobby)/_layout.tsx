import { Tabs, Stack } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { userJoined } from '@/store/slices/gameSlice';

export default function TabLayout() {
  useAuth();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const user_joined = (data:any) => {dispatch(userJoined(data))};
    socket?.on('user_joined', user_joined);
    return () => {
      socket?.off('user_joined', user_joined);
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
