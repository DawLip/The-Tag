import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';
import Background from '@c/Background';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Background/>
      <Text style={styles.heading}>Settings</Text>
      <Button label="Leave game" onPress={() => router.replace('/(main)/(home)/Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    padding: 48,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Aboreto',
    fontSize: 24,
    color: '#FFFFFF', 
    marginBottom: 38,
  },
});
