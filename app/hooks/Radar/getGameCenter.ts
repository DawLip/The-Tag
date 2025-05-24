import { useMemo } from 'react';

interface RadarPlayer {
  userId: string;
  latitude: number;
  longitude: number;
  type: number;
}

export function getGameCenter(
  players: RadarPlayer[],
  gameOwner: string | null,
  currentUserId: string | null,
  myPosition: [number, number] | null
): [number, number] | null {
  return useMemo(() => {
    // Jeśli właściciel to ja i mam pozycję
    if (gameOwner === currentUserId && myPosition) {
      return myPosition;
    }

    // Znajdź pozycję właściciela wśród graczy
    const ownerPos = players.find(p => p.userId === gameOwner);
    if (ownerPos) {
      return [ownerPos.latitude, ownerPos.longitude];
    }

    // Fallback
    if (players.length > 0) {
      const avgLat =
        players.reduce((acc, p) => acc + p.latitude, 0) / players.length;
      const avgLon =
        players.reduce((acc, p) => acc + p.longitude, 0) / players.length;
      return [avgLat, avgLon];
    }

    return null;
  }, [players, gameOwner, currentUserId, myPosition]);
}
