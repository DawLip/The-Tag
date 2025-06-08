import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/socket/socket';
import { addLog, lobbyUpdate } from '@/store/slices/gameSlice';
import { AppDispatch } from '@/store';

import VectorLog from '@img/LogsIcon.svg';
import VectorRadar from '@img/RadarIcon.svg';
import VectorSettings from '@img/Vector-3.svg';

export default function TabLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: any) => state.auth.userId);

  useAuth();
  const socket = useSocket();

  useEffect(() => {
    dispatch(addLog({ name: 'Game started', userId }));

    const game_update = (data: any) => {
      console.log('=== GAME_UPDATE ===');
      if (data.toChange?.logName) {
        dispatch(addLog({ name: data.toChange.logName, userId }));
      }
      dispatch(lobbyUpdate(data));
    };

    socket?.on('game_update', game_update);
    return () => {
      socket?.off('game_update', game_update);
    };
  }, []);

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
            borderLeftWidth: route.name !== '(logs)' ? 1 : 0,
            borderLeftColor: '#343437',
          },
        })}
      >
        <Tabs.Screen
          name="(logs)"
          options={{
            tabBarLabel: 'LOgS',
            tabBarIcon: ({ color }) => (
              <VectorLog fill={color} width={24} height={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="(radar)"
          options={{
            tabBarLabel: 'RADAR',
            tabBarIcon: ({ color }) => (
              <VectorRadar fill={color} width={24} height={24} />
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
