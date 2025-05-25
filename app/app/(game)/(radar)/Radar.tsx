import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Background from '@c/Background';
// @ts-ignore
import { RadarMap } from '@c/Radar/RadarMap';
import { SocketContext } from '@/socket/socket';

import { usePlayersUpdater } from '@/hooks/Radar/PlayersUpdat';
import { getGameCenter } from '@/hooks/Radar/getGameCenter';
import { useCheckOutOfBounds } from '@/hooks/Radar/useCheckOutOfBounds';
import { useEffectorsUpdater, RadarEffector } from '@/hooks/Radar/useEffectorsUpdater';

import PerkButton from '@c/Radar/PerkButton';

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
  const ZoomRadius = (GameRadius / 3) * 2 + 600;

  const playersList = useSelector((state: any) => state.game.players);
  const currentPlayer = playersList.find((player: any) => player._id === currentUserId);
  const [playerRole, setPlayerRole] = useState<number | null>(currentPlayer ? currentPlayer.role : null);
  const [hp, setHp] = useState(100);
  const decreaseHp = (amount: number) => setHp(prev => Math.max(prev - amount, 0));
  useEffect(() => {
    if (hp === 0) setPlayerRole(0);
  }, [hp]);

  const [players, setPlayers] = useState<RadarPlayer[]>([]);
  const [intervalMs, setIntervalMs] = useState(30000);
  const [myPosition, setMyPosition] = useState<[number, number] | null>(null);

  // Używamy hooka efektorów, który sam zarządza stanem efektorów i synchronizacją
  const effectors = useEffectorsUpdater();

  const [orbitalUses, setOrbitalUses] = useState(3);
  const [zapUses, setZapUses] = useState(5);
  const [trackerUses, setTrackerUses] = useState(2);
  const [invizUses, setInvizUses] = useState(1);

  // Dodajemy efektor lokalnie i emitujemy do serwera
  const addEffector = (newEffector: RadarEffector) => {
    if (socket && socket.connected && gameCode) {
      socket.emit('game_update', {
        type: 'effectors',
        payload: [newEffector],
      });
    }
    else{
      console.warn("nie udało się wysłać efektorów w game update")
    }
  };

  function useZap() {
    if (zapUses <= 0 || !socket || !socket.connected || !myPosition || !currentUserId) return;

    setZapUses(prev => Math.max(prev - 1, 0));

    const duration = 5000; // ms
    const now = Date.now();

    const zapEffector: RadarEffector = {
      latitude: myPosition[0],
      longitude: myPosition[1],
      radius: 45,
      StartTime: now,
      time: duration,
      startColor: '#0044FF',
      endColor: '#0000FF',
      type: 'zap',
    };

    addEffector(zapEffector);
    console.log(effectors)
  }

  const intervalMsRef = useRef(intervalMs);

  useEffect(() => {
    intervalMsRef.current = intervalMs;
  }, [intervalMs]);

  function useTracker() {
    if (trackerUses <= 0) return;

    setTrackerUses(prev => Math.max(prev - 1, 0));
    const previousInterval = intervalMsRef.current;

    setIntervalMs(1000);

    setTimeout(() => {
      setIntervalMs(previousInterval);
    }, 60000);
  }

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
      const randomOffset = Math.floor(Math.random() * 451) - 250;
      lastDamageTimeRef.current = now + randomOffset;
      decreaseHp(5);
    }
  }, []);

  useCheckOutOfBounds(myPosition, center ?? fallbackCenter, GameRadius, handleOutOfBounds);

  const [gameTime, setGameTime] = useState(1800); // seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <View style={styles.container}>
      <Background />

      <RadarMap
        playerHP={hp}
        playerType={playerRole}
        maxZoomRadius={ZoomRadius}
        players={players}
        border={{
          points: center ?? fallbackCenter,
          radius: GameRadius,
          color: '#CC4010',
        }}
        effectors={effectors}
        onPositionUpdate={(lat: any, lon: any) => sendMyPosition(lat, lon)}
      />

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>Time Left: {formatTime(gameTime)}</Text>
      </View>

      <View style={styles.abilitiesHeader}>
        <Text style={styles.abilitiesText}>umiejętności</Text>
      </View>

      <View style={styles.perksWrapper}>
        <View style={styles.perkButton}>
          <PerkButton
            icon={<Image source={require('@/assets/images/orbital_strike.png')} style={styles.icon} />}
            usesLeft={orbitalUses}
            activeDuration={3000}
            cooldownDuration={orbitalUses > 0 ? 20000 : 0}
            onUse={() => console.log('Orbital used')}
          />
        </View>

        <View style={styles.perkButton}>
          <PerkButton
            icon={<Image source={require('@/assets/images/zap.png')} style={styles.icon} />}
            usesLeft={zapUses}
            activeDuration={5000}
            cooldownDuration={zapUses > 0 ? 15000 : 0}
            onUse={() => {
              useZap();
              console.log('Zap used');
            }}
          />
        </View>

        <View style={styles.perkButton}>
          <PerkButton
            icon={<Image source={require('@/assets/images/tracker.png')} style={styles.icon} />}
            usesLeft={trackerUses}
            activeDuration={60000}
            cooldownDuration={trackerUses > 0 ? 360000 : 0}
            onUse={() => {
              useTracker();
              console.log('Tracker used');
            }}
          />
        </View>

        <View style={styles.perkButton}>
          <PerkButton
            icon={<Image source={require('@/assets/images/inviz.png')} style={styles.icon} />}
            usesLeft={invizUses}
            activeDuration={90000}
            cooldownDuration={invizUses > 0 ? 520000 : 0}
            onUse={() => console.log('Invisibility used')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  timeContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  abilitiesHeader: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  abilitiesText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  perksWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  perkButton: {
    width: '48%',
    marginBottom: 12,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
