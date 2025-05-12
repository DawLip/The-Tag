import { useSocket } from '@/socket/socket';
import { useEffect, useRef } from 'react';

export type PlayerPosition = {
  userId: string;
  latitude: number;
  longitude: number;
};

export type SimplifiedPlayer = {
  latitude: number;
  longitude: number;
  type: 'hider';
};

type Callback = (players: SimplifiedPlayer[]) => void;

export function usePlayerPositionManager(currentUserId: string) {
  const socket = useSocket();
  const playersRef = useRef<PlayerPosition[]>([]);
  const callbacksRef = useRef<Callback[]>([]);

  // Aktualizuje pozycję gracza w tablicy
  const updatePlayer = (data: PlayerPosition) => {
    const index = playersRef.current.findIndex(p => p.userId === data.userId);
    if (index !== -1) {
      playersRef.current[index] = data;
    } else {
      playersRef.current.push(data);
    }
  };

  // Zwraca innych graczy (poza currentUserId)
  const getOtherPlayers = (): SimplifiedPlayer[] => {
    return playersRef.current
      .filter(p => p.userId !== currentUserId)
      .map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
        type: 'hider',
      }));
  };

  // Powiadamia zarejestrowane callbacki
  const notify = () => {
    const others = getOtherPlayers();
    callbacksRef.current.forEach(cb => cb(others));
  };

  // Funkcja do wysyłania własnej pozycji
  const sendMyPosition = (latitude: number, longitude: number) => {
    if (!socket || !currentUserId) return;
    socket.emit('pos_update', {
      userId: currentUserId,
      latitude,
      longitude,
    });
  };

  // Rejestruje callback do aktualizacji pozycji innych graczy
  const onUpdate = (callback: Callback) => {
    callbacksRef.current.push(callback);
  };

  // Efekt do nasłuchiwania eventów socketu
  useEffect(() => {
    if (!socket) return;

    const handler = (data: PlayerPosition) => {
      updatePlayer(data);
      notify();
    };

    socket.on('pos_update', handler);

    return () => {
      socket.off('pos_update', handler);
    };
  }, [socket]);

  return { sendMyPosition, onUpdate };
}
