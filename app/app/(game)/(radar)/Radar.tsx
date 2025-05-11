import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { useSelector } from 'react-redux';
import { useSocket } from '@/socket/socket';
import { RadarMap } from './RadarMap';
import Background from '@c/Background';

import {
  playerPositionManager,
  SimplifiedPlayer
} from './playerPositionManager';

export default function RadarScreen() {
  const router = useRouter();
  const socket = useSocket();
  const [players, setPlayers] = useState<SimplifiedPlayer[]>([]);

  const currentUserId = useSelector((state: any) => state.auth.userId);
  useEffect(() => {
    if (!socket) return;

    // Inicjalizacja managera pozycji
    playerPositionManager.init(socket, currentUserId);

    // Rejestruj callback, który ustawia pozycje pozostałych graczy
    playerPositionManager.onUpdate((updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

  }, [socket]);

  if (!socket) {
    return (
      <View className="flex-1 justify-center items-center bg-bgc">
        <Text>Łączenie z serwerem...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bgc">
      <Background />
      <RadarMap
        playerType="hider"
        maxZoomRadius={1800}
        players={players}
        onPositionUpdate={(lat, lon) => {
          playerPositionManager.sendMyPosition(lat, lon);
        }}
      />
    </View>
  );
}
