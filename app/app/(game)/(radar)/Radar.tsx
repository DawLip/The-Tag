import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { usePlayerPositionManager, SimplifiedPlayer } from './playerPositionManager';
import Background from '@c/Background';
import { RadarMap } from './RadarMap';

export default function RadarScreen() {
  const currentUserId = useSelector((state: any) => state.auth.userId);
  const [players, setPlayers] = useState<SimplifiedPlayer[]>([]);
  const { sendMyPosition, onUpdate } = usePlayerPositionManager(currentUserId);

  useEffect(() => {
    if (!currentUserId) return;

    const callback = (updatedPlayers: SimplifiedPlayer[]) => {
      setPlayers(updatedPlayers);
    };

    onUpdate(callback);
  }, [currentUserId, onUpdate]);

  if (!currentUserId) {
    return (
      <View className="flex-1 justify-center items-center bg-bgc">
        <Text>Ładowanie użytkownika...</Text>
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
          sendMyPosition(lat, lon);
        }}
      />
    </View>
  );
}
