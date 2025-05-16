import React, { useEffect, useState, useContext, useRef } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Background from '@c/Background';
import { RadarMap } from './RadarMap';
import { SocketContext } from '@/socket/socket';

interface RawPlayer {
  userId: string;
  lat: number;
  lon: number;
}

interface RadarPlayer {
  latitude: number;
  longitude: number;
  type: string;
}

export default function RadarScreen() {
  const socket = useContext(SocketContext);
  const currentUserId = useSelector((state: any) => state.auth.userId);
  const gameCode = useSelector((state: any) => state.game.gameCode);

  const playersRef = useRef<Record<string, RawPlayer>>({});
  const [players, setPlayers] = useState<RadarPlayer[]>([]);
  const [intervalMs, setIntervalMs] = useState(1000);

  const sendMyPosition = (lat: number, lon: number) => {
    if (socket && socket.connected && gameCode && currentUserId) {
      socket.emit('pos_update', {
        gameCode,
        userId: currentUserId,
        pos: { lat, lon },
      });
    }
  };

  useEffect(() => {
    if (!socket) return;

    const onPlayersUpdate = (data: { userId: string; pos: { lat: number; lon: number } }) => {
      const { userId, pos } = data;
      if (userId !== currentUserId) {
        playersRef.current[userId] = {
          userId,
          lat: pos.lat,
          lon: pos.lon,
        };
      }
    };

    socket.on('pos_update', onPlayersUpdate);

    const timer = setInterval(() => {
      const formattedPlayers: RadarPlayer[] = Object.values(playersRef.current).map((p) => ({
        latitude: p.lat,
        longitude: p.lon,
        type: 'hider',
      }));

      //console.log('[RADAR] Formatted players:', formattedPlayers);

      setPlayers(formattedPlayers);
    }, intervalMs);

    return () => {
      socket.off('pos_update', onPlayersUpdate);
      clearInterval(timer);
    };
  }, [socket, currentUserId, intervalMs]);

  return (
    <View className="flex-1 bg-bgc">
      <Background />
      <RadarMap
        playerType="hider"
        maxZoomRadius={2500}
        players={players}
        onPositionUpdate={(lat, lon) => sendMyPosition(lat, lon)}
      />
    </View>
  );
}
