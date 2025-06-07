import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';

import Background from '@c/Background';

export default function EventsScreen() {
  const router = useRouter();
  const game = useSelector((state: any) => state.game);
  const userId = useSelector((state: any) => state.auth.userId);

  return (
    <View style={styles.container}>
      <Background />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.panel}>
          <LabelInput
            label="Name"
            value={game.name}
            isInput={game.owner === userId}
            setting="name"
          />
          <LabelInput
            label="Description"
            value={game.description}
            isInput={game.owner === userId}
            setting="description"
          />
        </View>

        <View style={styles.rolesPanel}>
          {game.roles.map((r: any, i: number) => (
            <View style={styles.inlineRow} key={i}>
              <Text style={styles.label}>{r.name}s:</Text>
              <Text style={styles.value}>
                {game.players.filter((p: any) => p.role === i).length}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const LabelInput = ({
  label,
  placeholder,
  value,
  setValue,
  isInput = false,
  setting = '',
}: {
  label: string;
  placeholder?: string;
  value: string;
  setValue?: (v: string) => void;
  isInput?: boolean;
  setting?: string;
}) => {
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const gameCode = useSelector((state: any) => state.game.gameCode);

  return (
    <View style={styles.inlineRow}>
      <Text style={styles.label}>{label}:</Text>
      {isInput ? (
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#777"
          onChangeText={(e: any) => {
            socket?.emit('lobby_update', { toChange: { [setting]: e }, gameCode });
          }}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    position: 'relative',
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 48,
    paddingBottom: 48,
    gap: 32,
  },
  panel: {
    gap: 16,
  },
  rolesPanel: {
    gap: 12,
  },
  inlineRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 22.4,
  },
  value: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 22.4,
  },
  input: {
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    fontSize: 16,
    width: 160,
    textAlign: 'right',
  },
});
