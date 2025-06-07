import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@c/Button';
import Background from '@c/Background';

import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';
import { gameStarted, lobbyUpdate } from '@/store/slices/gameSlice';

const gameVariants = ['DEMO', 'TURBO', 'MONKEY', 'MAFIA', 'SPEED', 'THE LAST ONE'];

export default function LobbySettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket();

  const userId = useSelector((state: any) => state.auth.userId);
  const gameCode = useSelector((state: any) => state.game.gameCode);
  const owner = useSelector((state: any) => state.game.owner);
  const settings = useSelector((state: any) => state.game.settings);

  const settingsNames = [
    { name: 'saveTime', label: 'Save time (min):' },
    { name: 'gameTime', label: 'Game time (min):' },
  ];

  const handleStartGame = () => {
    socket?.emit('start_game', { gameCode }, (res: any) => {
      console.log('Game started:', res);
    });
    dispatch(gameStarted({}));
    router.replace('/(game)/(radar)/Radar');
  };

  const setSetting = (value: string, settingName: string) => {
    const updated = { ...settings, [settingName]: Number(value) };
    socket?.emit('lobby_update', {
      toChange: { settings: updated },
      gameCode,
    });
    dispatch(lobbyUpdate({ toChange: { settings: updated }, gameCode }));
  };

  const handleLeaveLobby = () => {
    socket?.emit('leave_lobby', { gameCode });
    socket?.emit('leave_lobby_room', { gameCode });
    router.replace('/(main)/(home)/Home');
  };

  const handleVariantSelect = (variant: string) => {
    const updated = { ...settings, variant };
    socket?.emit('lobby_update', {
      toChange: { settings: updated },
      gameCode,
    });
    dispatch(lobbyUpdate({ toChange: { settings: updated }, gameCode }));
  };

  return (
    <View style={styles.container}>
      <Background />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Settings</Text>

        <Text style={styles.variantTitle}>Variant</Text>
        <View style={styles.variantGrid}>
          {gameVariants.map((variant) => {
            const isActive = settings.variant === variant;
            return (
              <TouchableOpacity
                key={variant}
                onPress={() => handleVariantSelect(variant)}
                style={[styles.variantOption, isActive ? styles.activeVariant : styles.inactiveVariant]}
              >
                <Text style={[styles.variantText, isActive ? styles.activeText : styles.inactiveText]}>
                  {variant}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.settingsContainer}>
          {settingsNames.map((item) => (
            <View key={item.name} style={styles.settingItem}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput
                value={String(settings[item.name])}
                onChangeText={(val) => setSetting(val, item.name)}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          ))}
        </View>

        <Button label="Leave lobby" onPress={handleLeaveLobby} />

        {owner === userId && <Button label="Start game" onPress={handleStartGame} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#262626',
  },
  scrollContent: {
    paddingHorizontal: 48,
    paddingVertical: 32,
    gap: 24,
  },
  heading: {
    fontSize: 32,
    fontFamily: 'Aboreto',
    color: 'white',
    textAlign: 'center',
  },
  variantTitle: {
    fontSize: 22,
    fontFamily: 'Aboreto',
    color: 'white',
    marginBottom: 8,
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    rowGap: 12,
  },
  variantOption: {
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeVariant: {
    backgroundColor: 'white',
  },
  inactiveVariant: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  variantText: {
    fontSize: 20,
    fontFamily: 'Aboreto',
  },
  activeText: {
    color: 'black',
  },
  inactiveText: {
    color: 'white',
    opacity: 0.3,
  },
  settingsContainer: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Aboreto',
  },
  input: {
    width: 80,
    fontSize: 20,
    color: 'white',
    fontFamily: 'Aboreto',
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
});
