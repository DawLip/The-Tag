import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { useSocket } from '@/socket/socket';

import { useDispatch } from 'react-redux';
import { joinLobby } from '@/store/slices/gameSlice';
import type { AppDispatch } from '@store/index';

import Button from '@c/Button';
import Background from '@c/Background';
import TextInput from '@c/inputs/TextInput';

import { useState } from 'react';

export default function CreateScreen() {
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>('');

  const createGame = () => {
    console.log('=== Create lobby ===');
    socket?.emit('create_lobby', {name}, (response: any) => {
      if (response.status !== 'SUCCESS') console.error('Error creating lobby:', response.status,response.message);
      console.log('Lobby created successfully:', response);
      
      dispatch(joinLobby(response.game));
      router.push('/(lobby)/(players)/Players');
    });
  }
  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.headerWrapper}>
        <Text style={styles.title}>NEW LOBBY</Text>
      </View>

      <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Enter lobby name"
            value={name}
            setValue={setName}
          />
      </View>

        <Button label="Create lobby" onPress={createGame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    padding: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerWrapper: {
    alignItems: 'center',
    marginBottom: -124,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Aboreto',
    lineHeight: 32,
  },

  label: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter',
    lineHeight: 22.4,
  },
});

