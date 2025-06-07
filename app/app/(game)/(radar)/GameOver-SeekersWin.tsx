import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';
import Background from '@c/Background';  // dopasuj ścieżkę importu

export default function GameOverScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
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

        <Button
          label="Spectate"
          onPress={() => router.back()}
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    zIndex: 1,              // żeby był nad tłem
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
