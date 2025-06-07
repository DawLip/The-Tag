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
  myPosition: [number, number],
  playerRole?: number,
  hp?: number,
  decreaseHp?: (amount: number) => void,
  gameCode?: string
) {
  const socket = useContext(SocketContext);
  const playersRef = useRef<Record<string, RawPlayer>>({});
  const effectorsRef = useRef<Effector[]>(effectors);
  const gameEndedRef = useRef(false); // ✅

  const hpRef = useRef(hp);
  const positionRef = useRef(myPosition);
  const roleRef = useRef(playerRole);
  const decreaseHpRef = useRef(decreaseHp);

  useEffect(() => { effectorsRef.current = effectors; }, [effectors]);
  useEffect(() => { hpRef.current = hp; }, [hp]);
  useEffect(() => { positionRef.current = myPosition; }, [myPosition]);
  useEffect(() => { roleRef.current = playerRole; }, [playerRole]);
  useEffect(() => { decreaseHpRef.current = decreaseHp; }, [decreaseHp]);

  function countAlivePlayersOfType(type: number): number {
    const others = Object.values(playersRef.current).filter(p => p.type === type).length;
    const selfMatches = roleRef.current === type ? 1 : 0;
    return others + selfMatches;
    
  }

  function checkEndConditions() {
    if (gameEndedRef.current) return;

    const runners = countAlivePlayersOfType(2);
    const seekers = countAlivePlayersOfType(1);

    if (runners === 0 || seekers === 0) {
      gameEndedRef.current = true;

      const message =
        seekers === 0
          ? 'Runnerzy wygrali! Wszyscy szukający zostali wyeliminowani.'
          : 'Szukający wygrali! Wszyscy biegacze zostali złapani.';

      socket?.emit('game_update', {
        gameCode,
        toChange: {
          logName: message,
          gameEnded: true,
        },
      });
    }
  }

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

        checkEndConditions(); // ✅ sprawdzaj od razu po aktualizacji gracza
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
      checkEndConditions(); 
    }, intervalMs);

    return () => {
      socket.off('pos_update', onPlayersUpdate);
      clearInterval(timer);
    };
  }, [socket, currentUserId, intervalMs, updateMapRadar]);

  useEffect(() => {
    if (!decreaseHp) return;

    const interval = setInterval(() => {
      if (!positionRef.current || roleRef.current === undefined || hpRef.current === undefined || hpRef.current <= 0 || !decreaseHpRef.current) {
        return;
      }

      if (roleRef.current === 2) {
        const isNearSeeker = Object.values(playersRef.current).some(p =>
          p.type === 1 &&
          getDistance(positionRef.current[0], positionRef.current[1], p.lat, p.lon) < 40
        );
        if (isNearSeeker) {
          console.log('Near seeker detected, decreasing HP by 5');
          decreaseHpRef.current(5);
        }

        const now = Date.now();
        const inZap = effectorsRef.current.some(e => {
          const active = now - e.StartTime < e.time;
          const dist = getDistance(positionRef.current[0], positionRef.current[1], e.latitude, e.longitude);
          return active && dist < e.radius && e.type.toLowerCase() === 'zap';
        });
        if (inZap) {
          console.log('In zap area, decreasing HP by 5');
          decreaseHpRef.current(5);
        }
      }

      const now = Date.now();
      const inDeadZone = effectorsRef.current.some(e =>
        e.type.toLowerCase() === 'deadzone' &&
        now - e.StartTime < e.time &&
        getDistance(positionRef.current[0], positionRef.current[1], e.latitude, e.longitude) < e.radius
      );
      if (inDeadZone) {
        decreaseHpRef.current(40);
      }

      checkEndConditions(); 
    }, 1000);

    return () => clearInterval(interval);
  }, [decreaseHp]);

  return {
    setIntervalMs: () => {},
    getPlayersCount: () => ({
      seekers: countAlivePlayersOfType(1),
      runners: countAlivePlayersOfType(2),
    }),
  };
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
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
