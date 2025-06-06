import { useContext, useEffect, useRef } from 'react';
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
  effectors: Effector[] = [],
  myPosition?: [number, number],
  playerRole?: number,
  hp?: number,
  decreaseHp?: (amount: number) => void
) {
  const socket = useContext(SocketContext);
  const playersRef = useRef<Record<string, RawPlayer>>({});
  const effectorsRef = useRef<Effector[]>(effectors);

  // Refs do trzymania aktualnych wartości dla useEffect z timerem
  const hpRef = useRef(hp);
  const positionRef = useRef(myPosition);
  const roleRef = useRef(playerRole);
  const decreaseHpRef = useRef(decreaseHp);

  // Synchronizacja refs gdy propsy się zmieniają
  useEffect(() => {
    effectorsRef.current = effectors;
  }, [effectors]);

  useEffect(() => {
    hpRef.current = hp;
  }, [hp]);

  useEffect(() => {
    positionRef.current = myPosition;
  }, [myPosition]);

  useEffect(() => {
    roleRef.current = playerRole;
  }, [playerRole]);

  useEffect(() => {
    decreaseHpRef.current = decreaseHp;
  }, [decreaseHp]);

  // Odbieranie pozycji graczy i aktualizacja radaru
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
          for (const eff of effectorsRef.current) {
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
  }, [socket, currentUserId, intervalMs, updateMapRadar]);

  useEffect(() => {
    //  console.log('useEffect decreaseHp triggered', decreaseHp);
  if (!decreaseHp) return;

  const interval = setInterval(() => {
    const hpNow = hpRef.current;
    const posNow = positionRef.current;
    const roleNow = roleRef.current;
    const decreaseHpNow = decreaseHpRef.current;

    if (!posNow || roleNow === undefined || hpNow === undefined || hpNow <= 0 || !decreaseHpNow) {
      // console.log('Skipping HP decrease: ', { posNow, roleNow, hpNow, decreaseHpNow });
      return;
    }
    // console.log('wywołuje sprawdzenie obniżenia HP')

    if (roleNow === 2) {
      // console.log('Gracz jest runner')
      // Sprawdzenie czy jest blisko seekerów
      const isNearSeeker = Object.values(playersRef.current).some(p =>
        p.type === 1 &&
        getDistance(posNow[0], posNow[1], p.lat, p.lon) < 20
      );
      if (isNearSeeker) {
        // console.log('Near seeker detected, decreasing HP by 5');
        decreaseHpNow(5);
      }

      const now = Date.now();

      // Sprawdzenie efektorów "zap" z debugiem
      const inZap = effectorsRef.current.some(e => {
        const active = now - e.StartTime < e.time;
        const dist = getDistance(posNow[0], posNow[1], e.latitude, e.longitude);
        const inRadius = dist < e.radius;
        const isZap = e.type.toLowerCase() === 'zap';

        // console.log((now - e.StartTime), e.time)
        // console.log(dist)
        // console.log(e.type.toLowerCase())

        const result = active && inRadius && isZap;

        return result;
      });
      if (inZap) {
        // console.log('In zap area, decreasing HP by 5');
        decreaseHpNow(5);
      }
    }

    // Sprawdzenie efektorów "deadZone" (dla wszystkich ról)
    const now = Date.now();
    const inDeadZone = effectorsRef.current.some(e =>
      e.type.toLowerCase() === 'deadzone' &&
      now - e.StartTime < e.time &&
      getDistance(posNow[0], posNow[1], e.latitude, e.longitude) < e.radius
    );
    if (inDeadZone) {
      // console.log('In deadZone area, decreasing HP by 40');
      decreaseHpNow(40);
    }

  }, 1000);

  return () => clearInterval(interval);
}, [decreaseHp]);

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
