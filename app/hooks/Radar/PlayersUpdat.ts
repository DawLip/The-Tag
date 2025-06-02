import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '@/socket/socket';

interface RawPlayer {
  userId: string;
  lat: number;
  lon: number;
  type: number;
}

interface RadarPlayer {
  userId: string;
  latitude: number;
  longitude: number;
  type: number;
  invisible: boolean;
}

interface Effector {
  latitude: number;
  longitude: number;
  radius: number;
  StartTime: number;
  time: number;
  type: string;
}

export function usePlayersUpdater(
  currentUserId: string,
  updateMapRadar: (players: RadarPlayer[]) => void,
  intervalMs = 1000,
  effectors: Effector[] = []
) {
  const socket = useContext(SocketContext);
  const playersRef = useRef<Record<string, RawPlayer>>({});

  useEffect(() => {
    if (!socket) return;

    const onPlayersUpdate = (data: { userId: string; pos: { lat: number; lon: number; type: number } }) => {
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
      const timeNow = Date.now();
      const formatted: RadarPlayer[] = Object.values(playersRef.current).map((p) => {
        const isRunner = p.type === 2;
        let invisible = false;

        if (isRunner) {
          for (const eff of effectors) {
            const active = timeNow - eff.StartTime < eff.time;
            if (!active || eff.type.toLowerCase() !== 'inviz') continue;

            const dist = getDistance(p.lat, p.lon, eff.latitude, eff.longitude);
            if (dist <= eff.radius) {
              invisible = true;
              break;
            }
          }
        }

        return {
          userId: p.userId,
          latitude: p.lat,
          longitude: p.lon,
          type: p.type,
          invisible,
        };
      });

      updateMapRadar(formatted);
    }, intervalMs);

    return () => {
      socket.off('pos_update', onPlayersUpdate);
      clearInterval(timer);
    };
  }, [socket, currentUserId, intervalMs, updateMapRadar, effectors]);

  return { setIntervalMs: () => {} };
}

// Haversine formula (approx.)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
