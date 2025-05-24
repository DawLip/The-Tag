import React, { useState, useContext, useCallback } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import Background from '@c/Background';
// @ts-ignore
import { RadarMap } from '@c/Radar/RadarMap';
import { SocketContext } from '@/socket/socket';

import { usePlayersUpdater } from '@/hooks/Radar/PlayersUpdat';
import { getGameCenter } from '@/hooks/Radar/getGameCenter';
import { useCheckOutOfBounds } from '@/hooks/Radar/useCheckOutOfBounds';

interface RadarPlayer {
  userId: string;
  latitude: number;
  longitude: number;
  type: number;
}

export default function RadarScreen() {
  const socket = useContext(SocketContext);
  const currentUserId = useSelector((state: any) => state.auth.userId);
  const gameCode = useSelector((state: any) => state.game.gameCode);
  const gameOwner = useSelector((state: any) => state.game.owner);

  const playersList = useSelector((state: any) => state.game.players);
  const currentPlayer = playersList.find(
    (player: any) => player._id === currentUserId
  );
  const [playerRole, setPlayerRole] = useState<number | null>(currentPlayer ? currentPlayer.role : null);
  const changeRole = (newRole: number) => {
    setPlayerRole(newRole);
  };

  const [players, setPlayers] = useState<RadarPlayer[]>([]);
  const [intervalMs, setIntervalMs] = useState(1000);
  const [myPosition, setMyPosition] = useState<[number, number] | null>(null);

  usePlayersUpdater(currentUserId, setPlayers, intervalMs);

  const center = getGameCenter(players, gameOwner, currentUserId, myPosition);
  const fallbackCenter: [number, number] = [50.2313, 18.9459];

  const sendMyPosition = (lat: number, lon: number) => {
    setMyPosition([lat, lon]);
    if (socket && socket.connected && gameCode && currentUserId) {
      socket.emit('pos_update', {
        gameCode,
        userId: currentUserId,
        pos: { lat, lon, playerRole },
      });
    }
  };

  const handleOutOfBounds = useCallback(() => {
    console.warn('Gracz wyszedł poza granice!');
    //puki co bez efektu
  }, []);

  useCheckOutOfBounds(myPosition, center ?? fallbackCenter, 1800, handleOutOfBounds);

  return (
    <View className="flex-1 bg-bgc">
      <Background />
      <RadarMap
        playerType={playerRole}
        maxZoomRadius={2500}
        players={players}
        border={{
          points: center ?? fallbackCenter,
          radius: 1800,
          color: '#CC4010',
        }}
        onPositionUpdate={(lat:any, lon:any) => sendMyPosition(lat, lon)}
      />
    </View>
  );
}
