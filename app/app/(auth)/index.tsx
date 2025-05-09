import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';
import Logo from '@img/Logo.svg';
import AssistiveChip from '@c/AssistiveChip';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>THE TAG</Text>
      <Logo width={361} height={366.6} />

      <View style={styles.buttonGroup}>
        <Button label="LOG IN" onPress={() => router.push('/(auth)/Login')} />
        <Button label="PLAY AS GUEST" onPress={() => router.push('/(auth)/AsGuest')} />
        <AssistiveChip
          label="Create account"
          variant="OUTLINE-WHITE"
          onPress={() => router.push('/(auth)/Register')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 48,
  },
  title: {
    fontFamily: 'Aboreto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 64,
    lineHeight: 64,
    color: '#FFFFFF',
    width: 277,
    height: 64,
    textAlign: 'center', 
    alignSelf: 'center', 
  },
  buttonGroup: {
    width: '100%',
    gap: 16, 
  },
});

