import { Tabs, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/socket/socket';
import { lobbyUpdate } from '@/store/slices/gameSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';


export default function TabLayout() {
  const dispatch = useDispatch<AppDispatch>();

  useAuth();

  const socket = useSocket();

  useEffect(()=>{
    const game_update = (data:any) => {
      console.log("=== GAME_UPDATE ===")
      dispatch(lobbyUpdate(data))
    }

    socket?.on("game_update", game_update);
    return ()=>{
      socket?.off("game_update", game_update);
    }
  },[])

  return (
    <SafeAreaView style={{flex: 1}} className='bg-bgc'>
      <Tabs>
        <Tabs.Screen name="(logs)" options={{ headerShown: false }} />
        <Tabs.Screen name="(radar)" options={{ headerShown: false }} />
        <Tabs.Screen name="(settings)" options={{ headerShown: false }} />
      </Tabs>
    </SafeAreaView>
  );
}


