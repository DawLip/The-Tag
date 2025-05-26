import { Tabs, Stack, useRouter } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { gameStarted, lobbyUpdate, userJoined } from '@/store/slices/gameSlice';

import VectorLog from '@img/LogsIcon.svg';
import VectorUser from '@img/UsersIcon.svg';
import VectorSettings from '@img/Vector-3.svg';

export default function TabLayout() {
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector((state: any) => state.auth.userId);
  const gameCode = useSelector((state: any) => state.game.gameCode);

  useAuth();

  useEffect(() => {
    console.log("Active socket:", socket?.id);
    const user_joined = (data:any) => {dispatch(userJoined(data))};
    const lobby_update = (data:any) => {
      console.log('Layout lobby_update');

      for(const key in data.toChange) {
        if(key === 'players') {
          if(!data.toChange.players.some((player:any) => player._id === userId)){
            socket?.emit('leave_lobby_room', {gameCode}); 
            router.replace('/(main)/(home)/Home');
          }
        }
      }

      dispatch(lobbyUpdate(data))
    };
    const game_started = (data:any) => {
      console.log('Game started:', data);
      dispatch(gameStarted(data));
      router.replace('/(game)/(radar)/Radar');
    }
    
    socket?.on('user_joined', user_joined);
    socket?.on('lobby_update', lobby_update);
    socket?.on('game_started', game_started);
    return () => {
      socket?.off('user_joined', user_joined);
      socket?.off('lobby_update', lobby_update);
      socket?.off('game_started', game_started);
    }
  }, [socket]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#262626' }}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#262626',
            height: 64,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontFamily: 'Aboreto',
            fontSize: 12,
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#636363',
          tabBarItemStyle: {
            width: 131,
            height: 64,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderLeftWidth: route.name !== '(events)' ? 1 : 0,
            borderLeftColor: '#343437',
          },
        })}
      >
        <Tabs.Screen
          name="(events)"
          options={{
            tabBarLabel: 'EVENTS',
            tabBarIcon: ({ color }) => (
              <VectorLog fill={color} width={24} height={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="(players)"
          options={{
            tabBarLabel: 'PLAYERS',
            tabBarIcon: ({ color }) => (
              <VectorUser fill={color} width={24} height={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="(settings)"
          options={{
            tabBarLabel: 'SETTINGS',
            tabBarIcon: ({ color }) => (
              <VectorSettings fill={color} width={24} height={24} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}