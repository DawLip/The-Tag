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

export function useEffectorsUpdater(gameCode: string) {
  const socket = useContext(SocketContext);
  const [effectors, setEffectors] = useState<RadarEffector[]>([]);

const addEffectors = useCallback((newEffectors: RadarEffector[]) => {
  setEffectors(prev => {
    const newMap = new Map(newEffectors.map(ne => [`${ne.StartTime}_${ne.type}`, ne]));

    const updated = prev.map(eff => {
      const key = `${eff.StartTime}_${eff.type}`;
      if (newMap.has(key)) {
        return newMap.get(key)!; // zamieniam na nowy efektor
      }
      return eff; 
    });

    const existingKeys = new Set(prev.map(e => `${e.StartTime}_${e.type}`));
    const added = newEffectors.filter(ne => !existingKeys.has(`${ne.StartTime}_${ne.type}`));

    if (added.length > 0) {
      console.log('Dodaję nowe efektory:', added);
    }

    return [...updated, ...added];
  });
}, []);

  useEffect(() => {
    if (!socket || !gameCode) return;

    const onGameUpdate = (data: any) => {
      console.log('Odebrano event game_update:', data);

      if (data.gameCode && data.gameCode !== gameCode) return;

      if (data.toChange && typeof data.toChange === 'object') {
        const toChange = data.toChange;
        if (toChange.type === 'effectors' && Array.isArray(toChange.effectors)) {
          addEffectors(toChange.effectors);
        }
      }
    };

    socket.on('game_update', onGameUpdate);

    return () => {
      socket.off('game_update', onGameUpdate);
    };
  }, [socket, addEffectors, gameCode]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setEffectors(prev => {
        const filtered = prev.filter(eff => eff.StartTime + eff.time > now);
        if (filtered.length !== prev.length) {
          console.log('Usuwam wygasłe efektory');
        }
        return filtered;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return effectors;
}
