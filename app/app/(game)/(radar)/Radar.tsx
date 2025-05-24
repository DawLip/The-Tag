import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
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
  const GameRadius = 3000;
  const ZoomRadius = GameRadius/3 + 600;

  const playersList = useSelector((state: any) => state.game.players);
  const currentPlayer = playersList.find(
    (player: any) => player._id === currentUserId
  );
  const [playerRole, setPlayerRole] = useState<number | null>(currentPlayer ? currentPlayer.role : null);
  const changeRole = (newRole: number) => {
    setPlayerRole(newRole);
  };
  const [hp, setHp] = useState(100);
  const decreaseHp = (amount: number) => {
    setHp(prev => Math.max(prev - amount, 0));
  };
  useEffect(() => {
    if (hp === 0) {
      setPlayerRole(0);
    }
  }, [hp]);

  const [players, setPlayers] = useState<RadarPlayer[]>([]);
  const [intervalMs, setIntervalMs] = useState(1000);
  const [myPosition, setMyPosition] = useState<[number, number] | null>(null);

  usePlayersUpdater(currentUserId, setPlayers, intervalMs);

  const center = getGameCenter(players, gameOwner, currentUserId, myPosition);
  const fallbackCenter: [number, number] = [50.22774943220666, 18.90917709012359];

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

const lastDamageTimeRef = useRef<number>(0);
const handleOutOfBounds = useCallback(() => {
  const now = Date.now();
  if (now - lastDamageTimeRef.current >= 1000) {
    const randomOffset = Math.floor(Math.random() * 451) - 250; // [-250, 200]
    lastDamageTimeRef.current = now + randomOffset;
    decreaseHp(5);
  }
}, []);



  // useCheckOutOfBounds(myPosition, center ?? fallbackCenter, GameRadius, handleOutOfBounds);
  useCheckOutOfBounds(myPosition, fallbackCenter, GameRadius, handleOutOfBounds);

  return (
    <View className="flex-1 bg-bgc">
      <Background />
      <RadarMap
        playerHP={hp}
        playerType={playerRole}
        maxZoomRadius={ZoomRadius}
        players={players}
        border={{
          //points: center ?? fallbackCenter,//fallbackCenter,
          points: fallbackCenter,
          radius: GameRadius,
          color: '#CC4010',
        }}
        onPositionUpdate={(lat:any, lon:any) => sendMyPosition(lat, lon)}
      />
    </View>
  );
}
