import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '@/socket/socket';

interface RawPlayer {
  userId: string;
  lat: number;
  lon: number;
  type:number;
}

interface RadarPlayer {
  userId: string;
  latitude: number;
  longitude: number;
  type: number;
}

export function usePlayersUpdater(
  currentUserId: string,
  updateMapRadar: (players: RadarPlayer[]) => void,
  initialInterval = 1000
) {
  const socket = useContext(SocketContext);
  const playersRef = useRef<Record<string, RawPlayer>>({});
  const [intervalMs, setIntervalMs] = useState(initialInterval);

  useEffect(() => {
    if (!socket) return;

    const onPlayersUpdate = (data: { userId: string; pos: { lat: number; lon: number, type:number } }) => {
      if (!data?.userId || !data?.pos) return;

      const { userId, pos } = data;

      if (userId !== currentUserId) {
        playersRef.current[userId] = {
          userId,
          lat: pos.lat,
          lon: pos.lon,
          type: pos.type,
        };
      }
    };

    socket.on('pos_update', onPlayersUpdate);

    const timer = setInterval(() => {
      const formatted: RadarPlayer[] = Object.values(playersRef.current).map((p) => ({
        userId: p.userId,
        latitude: p.lat,
        longitude: p.lon,
        type: p.type,
      }));
      updateMapRadar(formatted);
    }, intervalMs);

    return () => {
      socket.off('pos_update', onPlayersUpdate);
      clearInterval(timer);
    };
  }, [socket, currentUserId, intervalMs, updateMapRadar]);

  return { setIntervalMs };
}
