import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';
import Background from '@c/Background'; // upewnij się, że ścieżka jest poprawna

export default function GameOverScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.content}>
        <Text style={[styles.title, { fontFamily: 'Aboreto' }]}>
          Game Over
        </Text>

        <Text style={styles.subtitle}>
          Seekers Win!
        </Text>

        <Button
          label="Leave game"
          onPress={() => router.replace('/(main)/(home)/Home')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    backgroundColor: 'transparent',
  },
  content: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    marginBottom: 16,
  },
  subtitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 24,
  },
});
