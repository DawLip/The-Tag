import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import Background from '@c/Background';
import TextInput from '@c/inputs/TextInput';
import Button from '@c/Button';

export default function JoinGameScreen() {
  const [code, setCode] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Background />

      <View style={styles.content}>
        <TextInput
          label="Game code"
          value={code}
          placeholder="Enter code"
          setValue={setCode}
        />

        <Button
          label="PLAY"
          style={{ marginTop: 24 }}
          textStyle={{ fontSize: 18 }}
        />
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  content: {
    width: 297,
    zIndex: 3,
    alignItems: 'stretch',
  },
});
