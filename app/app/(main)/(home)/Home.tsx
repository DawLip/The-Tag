import { useSocket } from '@/socket/socket';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet,Pressable, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Background from '@c/Background';

export default function HomeScreen() {
  const router = useRouter();
  const socket = useSocket();
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    console.log('=== Home screen ===');
    console.log('token:', token);
    if(!socket){return;}

    socket.auth = { token: `Bearer ${token}` };
    socket?.connect();
    socket?.on('connect', () => {
      console.log('Socket connected');
    });
    socket?.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    socket?.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Background />

      <Text style={styles.title}>THE TAG</Text>

      <Text style={styles.section}>JOIN GAME BY:</Text>

      <View style={styles.row}>
        <GameButton label="GAME CODE" onPress={() => router.push('/(main)/(home)/JoinGameCode')} />
        <GameButton label="QR CODE" onPress={() => router.push('/(main)/(home)/JoinQRCode')} />
      </View>

      <Text style={styles.section}>CURRENT EVENTS:</Text>

      <View style={styles.row}>
        <GameButton label="TURBO" onPress={() => {}} />
        <GameButton label="THE MONKEY" onPress={() => {}} />
      </View>
    </View>
  );
}

function GameButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  title: {
    fontFamily: 'Aboreto',
    fontSize: 64,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginBottom: 16,
  },
  section: {
    fontFamily: 'Aboreto',
    fontSize: 18,
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  button: {
    width: 140.5,
    height: 80,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#343437',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Aboreto',
    fontSize: 16,
  },
});
