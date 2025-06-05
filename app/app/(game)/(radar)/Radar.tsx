import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Background from '@c/Background';
// @ts-ignore
import { RadarMap } from '@c/Radar/RadarMap';
import { SocketContext } from '@/socket/socket';

import { usePlayersUpdater } from '@/hooks/Radar/PlayersUpdat';
import { getGameCenter } from '@/hooks/Radar/getGameCenter';
import { useCheckOutOfBounds } from '@/hooks/Radar/useCheckOutOfBounds';
import { useEffectorsUpdater, RadarEffector } from '@/hooks/Radar/useEffectorsUpdater';
import { calculateOffsetPosition } from '@c/Radar/RadarUtils';
import PerkButton from '@c/Radar/PerkButton';
import { useRouter } from 'expo-router';

interface RadarPlayer {
  userId: string;
  latitude: number;
  longitude: number;
  type: number;
}

export default function RadarScreen() {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const currentUserId = useSelector((state: any) => state.auth.userId);
  const gameCode = useSelector((state: any) => state.game.gameCode);
  const gameOwner = useSelector((state: any) => state.game.owner);
  // const GameRadius = useSelector((state: any) => state.game.GameRadius);
  const GameRadius = 3000;
  const SeekersConfainmentRadius = 70;
  const ZoomRadius = (GameRadius / 3) * 2 + 600;

  // const [saveTime, setSaveTime] = useState(200); // seconds
  // const [gameTime, setGameTime] = useState(1800); // seconds

  const settingsSaveTime = useSelector((state: any) => state.game.settings.saveTime)
  const settingsGameTime = useSelector((state: any) => state.game.settings.gameTime)
  const [gameTime, setGameTime] = useState(settingsGameTime * 60); // seconds
  const [saveTime, setSaveTime] = useState(settingsSaveTime * 60); // seconds
  
useEffect(() => {
  const interval = setInterval(() => {
    setSaveTime(prevSaveTime => {
      if(prevSaveTime > 0)
        return prevSaveTime - 1;
      return 0;

    });

    setGameTime(prevGameTime => {
      if (saveTime === 0 && prevGameTime > 0) {
        return prevGameTime - 1;
      }
      return prevGameTime;
    });
  }, 1000);

  return () => clearInterval(interval);
  }, [saveTime]);
  
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };


  const playersList = useSelector((state: any) => state.game.players);
  const currentPlayer = playersList.find((player: any) => player._id === currentUserId);
  const [playerRole, setPlayerRole] = useState<number | null>(currentPlayer ? currentPlayer.role : null);
  
  const [hp, setHp] = useState(100);
  
  const decreaseHp = useCallback((amount: number) => {
      if(playerRole === 2 && saveTime > 0) return;

    setHp(prev => {
      const newHp = Math.max(prev - amount, 0);
      // console.log(`Zmniejszam HP: ${prev} -> ${newHp}`);
      return newHp;
    });
  }, []);
  
  useEffect(() => {
    if (hp === 0) setPlayerRole(0);
  }, [hp]);

  const [players, setPlayers] = useState<RadarPlayer[]>([]);
  const [intervalMs, setIntervalMs] = useState(30000);
  const [myPosition, setMyPosition] = useState<[number, number]>([50,50]);
  const [myHeading, setMyHeading] = useState<number | undefined>();

  const effectors = useEffectorsUpdater(gameCode);

  const [orbitalUses, setOrbitalUses] = useState(3);
  const [zapUses, setZapUses] = useState(5);
  const [trackerUses, setTrackerUses] = useState(2);
  const [invizUses, setInvizUses] = useState(1);

  const EFFECTOR_DURATIONS = {
    zap: 5000,
    inviz: 90000,
    tracker: 60000,
    orbitalCountdown: 8000,
    orbitalDeadZone: 30000,
  };

  function addEffector(newEffector: RadarEffector) {
    if (socket && socket.connected && gameCode) {
      socket.emit('game_update', {
        gameCode,
        toChange: {
          type: 'effectors',
          effectors: [newEffector],
        },
      });
      // console.log('Wysłano nowy efektor:', newEffector);
    } else {
      console.warn('Nie udało się wysłać efektorów w game_update - brak połączenia lub gameCode');
    }
  }

  function addDynamicEffector(baseEffector: RadarEffector, getPosition: () => [number, number] | null) {
    if (!socket || !socket.connected || !gameCode) {
      console.warn('Nie udało się wysłać efektora (dynamicznego) - brak połączenia lub gameCode');
      return;
    }

    const duration = baseEffector.time;
    const startTime = baseEffector.StartTime;
    let elapsed = 0;

    const interval = setInterval(() => {
      const pos = getPosition();
      if (!pos) return;

      const dynamicEffector: RadarEffector = {
        ...baseEffector,
        latitude: pos[0],
        longitude: pos[1],
        StartTime: startTime,
      };

      socket.emit('game_update', {
        gameCode,
        toChange: {
          type: 'effectors',
          effectors: [dynamicEffector],
        },
      });

      elapsed += 500;
      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 500);
  }

  function useOrbitalStrike(heading: number = 0) {
    if (orbitalUses <= 0 || !socket || !socket.connected || !myPosition || !currentUserId) return;

    setOrbitalUses(prev => Math.max(prev - 1, 0));
    const now = Date.now();

    const targetPosition = calculateOffsetPosition(myPosition, 520, heading);

    const countdownEffector: RadarEffector = {
      latitude: targetPosition[0],
      longitude: targetPosition[1],
      radius: 100,
      StartTime: now,
      time: EFFECTOR_DURATIONS.orbitalCountdown,
      startColor: '#FF6600',
      endColor: '#FF0000',
      type: 'countdown',
    };

    addEffector(countdownEffector);

    setTimeout(() => {
      const deadZoneEffector: RadarEffector = {
        latitude: targetPosition[0],
        longitude: targetPosition[1],
        radius: 95,
        StartTime: Date.now(),
        time: EFFECTOR_DURATIONS.orbitalDeadZone,
        startColor: '#440000',
        endColor: '#000000',
        type: 'deadZone',
      };
      addEffector(deadZoneEffector);
    }, EFFECTOR_DURATIONS.orbitalCountdown);
  }

  function useZap() {
    if (zapUses <= 0 || !socket || !socket.connected || !myPosition || !currentUserId) return;

    setZapUses(prev => Math.max(prev - 1, 0));

    const now = Date.now();

    const zapEffector: RadarEffector = {
      latitude: myPosition[0],
      longitude: myPosition[1],
      radius: 45,
      StartTime: now,
      time: EFFECTOR_DURATIONS.zap,
      startColor: '#00BBFF',
      endColor: '#0000FF',
      type: 'zap',
    };
    addDynamicEffector(zapEffector, () => myPosition);
  }

  function useInviz() {
    if (invizUses <= 0 || !socket || !socket.connected || !myPosition || !currentUserId) return;

    setInvizUses(prev => Math.max(prev - 1, 0));

    const now = Date.now();

    const invizEffector: RadarEffector = {
      latitude: myPosition[0],
      longitude: myPosition[1],
      radius: 100,
      StartTime: now,
      time: EFFECTOR_DURATIONS.inviz,
      startColor: '#AAEEFF',
      endColor: '#FFFFFF',
      type: 'inviz',
    };
    addDynamicEffector(invizEffector, () => myPosition);
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
    }, EFFECTOR_DURATIONS.tracker);
  }

  usePlayersUpdater(
    currentUserId,
    setPlayers,
    intervalMs,
    effectors,
    myPosition ?? undefined,
    playerRole ?? undefined,
    hp,
    decreaseHp
  );

  const center = getGameCenter(players, gameOwner, currentUserId, myPosition);
  //const fallbackCenter: [number, number] = [myPosition[0], myPosition[1]];
  const fallbackCenter: [number, number] = [50,50];

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
  }, [decreaseHp]);

  useCheckOutOfBounds(myPosition, center ?? fallbackCenter, GameRadius, handleOutOfBounds);


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
        radius: (playerRole == 1 && saveTime > 0)? SeekersConfainmentRadius: GameRadius,
        color: '#CC4010',
      }}
      effectors={effectors}
      onPositionUpdate={(lat: any, lon: any) => sendMyPosition(lat, lon)}
      onHeadingUpdate={(heading: any) => setMyHeading(heading)}
    />

    <View style={styles.timeContainer}>
        {saveTime > 0 ? (
    <Text style={styles.timeText}>
      Save Time: {formatTime(saveTime)}
    </Text>
  ) : (
    <Text style={styles.timeText}>
      Time Left: {formatTime(gameTime)}
    </Text>
  )}
    </View>

    <TouchableOpacity onPress={()=>{router.push('/(game)/(radar)/Hint')}} style={styles.abilitiesHeader} className='flex-row gap-2'>
      <Text style={styles.abilitiesText}>Umiejętności</Text>
      <Image source={require('@/assets/images/infoIcon.png')} style={{width: 32, height:32}} />
    </TouchableOpacity>

    {playerRole !== 0 && (
      <View style={styles.perksWrapper}>
        {playerRole === 1 && (
          <View style={styles.perkButton}>
            <PerkButton
              icon={<Image source={require('@/assets/images/orbital_strike.png')} style={styles.icon} />}
              usesLeft={orbitalUses}
              activeDuration={2500}
              cooldownDuration={0}
              onUse={() => useOrbitalStrike(myHeading)}
            />
          </View>
        )}

        {(playerRole === 1) && (
          <View style={styles.perkButton}>
            <PerkButton
              icon={<Image source={require('@/assets/images/zap.png')} style={styles.icon} />}
              usesLeft={zapUses}
              activeDuration={5000}
              cooldownDuration={zapUses > 0 ? 15000 : 0}
              onUse={() => useZap()}
            />
          </View>
        )}

        {(playerRole === 1) && (
          <View style={styles.perkButton}>
            <PerkButton
              icon={<Image source={require('@/assets/images/tracker.png')} style={styles.icon} />}
              usesLeft={trackerUses}
              activeDuration={60000}
              cooldownDuration={trackerUses > 0 ? 360000 : 0}
              onUse={() => useTracker()}
            />
          </View>
        )}

        {(playerRole === 2) && (
          <View style={styles.perkButton}>
            <PerkButton
              icon={<Image source={require('@/assets/images/inviz.png')} style={styles.icon} />}
              usesLeft={invizUses}
              activeDuration={90000}
              cooldownDuration={invizUses > 0 ? 520000 : 0}
              onUse={() => useInviz()}
            />
          </View>
        )}
      </View>
    )}
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
