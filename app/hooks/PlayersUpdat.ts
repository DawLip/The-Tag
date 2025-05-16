import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '@/socket/socket';

interface RawPlayer {
  userId: string;
  lat: number;
  lon: number;
}

interface RadarPlayer {
  latitude: number;
  longitude: number;
  type: string; // e.g., 'hider'
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
      const playersArray: RadarPlayer[] = Object.values(playersRef.current).map((p) => ({
        latitude: p.lat,
        longitude: p.lon,
        type: 'hider',
      }));
      updateMapRadar(playersArray);
    }, intervalMs);

    return () => {
      socket.off('pos_update', onPlayersUpdate);
      clearInterval(timer);
    };
  }, [intervalMs, currentUserId, updateMapRadar, socket]);

  return { setIntervalMs };
}
