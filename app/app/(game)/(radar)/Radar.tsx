import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Background from '@c/Background';
import { RadarMap } from '@c/Radar/RadarMap';
import { SocketContext } from '@/socket/socket';
import { usePlayersUpdater } from '@/hooks/PlayersUpdat';

interface RadarPlayer {
  latitude: number;
  longitude: number;
  type: string;
}

export default function RadarScreen() {
  const socket = useContext(SocketContext);
  const currentUserId = useSelector((state: any) => state.auth.userId);
  const gameCode = useSelector((state: any) => state.game.gameCode);

  const [players, setPlayers] = useState<RadarPlayer[]>([]);
  const [intervalMs, setIntervalMs] = useState(1000);

  usePlayersUpdater(currentUserId, setPlayers, intervalMs);

  const sendMyPosition = (lat: number, lon: number) => {
    if (socket && socket.connected && gameCode && currentUserId) {
      socket.emit('pos_update', {
        gameCode,
        userId: currentUserId,
        pos: { lat, lon },
      });
    }
  };

  return (
    <View className="flex-1 bg-bgc">
      <Background />
      <RadarMap
        playerType="hider"
        maxZoomRadius={2500}
        players={players}
        border={{
          points: [50.23130254898192, 18.94595480308516],
          radius: 1800,
          color: '#CC4010',
        }}
        onPositionUpdate={(lat, lon) => sendMyPosition(lat, lon)}
      />
    </View>
  );
}
