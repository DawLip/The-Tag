import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { useSocket } from '@/socket/socket';
import Background from '@c/Background';

export default function LogsScreen() {
  const router = useRouter();
  const socket = useSocket();
  const logs = useSelector((state: any) => state.game.gameLogs);
  const gameCode = useSelector((state: any) => state.game.gameCode);
  const userId = useSelector((state: any) => state.auth.userId);

  return (
    <View style={styles.container}>
      <Background/>
      {logs.map((log: any, index: number) => (
        <LogItem key={index} log={log} />
      ))}
    </View>
  );
}

const LogItem = ({ log }: { log: any }) => {
  return (
    <View style={styles.logItem}>
      <Text style={styles.date}>{formatDate(log.date)}</Text>
      <Text style={styles.name}>{log.name}</Text>

      <View style={styles.meta}>
        <Text style={styles.label}>
          players: <Text style={styles.value}>{log.playersRemaining}</Text>
        </Text>
        <Text style={styles.label}>
          Your role: <Text style={styles.value}>{log.yourRole}</Text>
        </Text>
        <Text style={styles.label}>
          Time remaining: <Text style={styles.value}>{log.timeRemaining || '—'}</Text>
        </Text>
      </View>
    </View>
  );
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const d = (n: number) => String(n).padStart(2, '0');
  return `${d(date.getDate())}.${d(date.getMonth() + 1)}.${date.getFullYear()} ${d(date.getHours())}:${d(date.getMinutes())}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    padding: 48,
  },
  logItem: {
    marginBottom: 20,
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: '#929292',
    fontFamily: 'Aboreto',
    lineHeight: 12,
  },
  name: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Aboreto',
    lineHeight: 16,
  },
  meta: {
    marginTop: 6,
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#929292',
    fontFamily: 'Aboreto',
    lineHeight: 12,
  },
  value: {
    color: '#FFFFFF',
  },
});
