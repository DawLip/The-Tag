import { useContext, useEffect, useState, useCallback } from 'react';
import { SocketContext } from '@/socket/socket';

export interface RadarEffector {
  latitude: number;
  longitude: number;
  radius: number;
  StartTime: number;
  time: number;
  startColor: string;
  endColor: string;
  type: string;
}

export function useEffectorsUpdater() {
  const socket = useContext(SocketContext);
  const [effectors, setEffectors] = useState<RadarEffector[]>([]);

  // Dodaj nowe efektory do listy, unikając duplikatów
  const addEffectors = useCallback((newEffectors: RadarEffector[]) => {
    setEffectors(prev => {
      const filteredNew = newEffectors.filter(
        ne => !prev.some(e => e.StartTime === ne.StartTime && e.type === ne.type)
      );
      return [...prev, ...filteredNew];
    });
  }, []);

  // Obsługa eventu 'game_update' z serwera
  useEffect(() => {
    if (!socket) return;

    const onGameUpdate = (data: { type: string; payload: RadarEffector[] }) => {
      if (data?.type === 'effectors' && Array.isArray(data.payload)) {
        addEffectors(data.payload);
      }
    };

    socket.on('game_update', onGameUpdate);

    return () => {
      socket.off('game_update', onGameUpdate);
    };
  }, [socket, addEffectors]);

  // Czyszczenie wygasłych efektorów co sekundę
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setEffectors(prev => prev.filter(eff => eff.StartTime + eff.time > now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return effectors;
}
