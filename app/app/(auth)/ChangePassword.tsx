import { StyleSheet, View, Dimensions } from 'react-native';
import Background from '@c/Background';
import Button from '@c/Button';
import TextInput from '@c/inputs/TextInput';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Background />

      <View style={styles.content}>
        {/* Frame 23 – input section */}
        <View style={styles.inputGroup}>
          <TextInput
            label="New password"
            value={password}
            setValue={setPassword}
          />

          <TextInput
            label="Repeat password"
            value={repeatPassword}
            setValue={setRepeatPassword}
          />
        </View>

        <Button
          label="Change Password"
          onPress={() => router.push('/(auth)/ChangePassword')}
          textStyle={{ fontSize: 20 }}
          style={{ marginTop: 24 }}
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
  inputGroup: {
    width: 297,
    height: 164,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
  },
});
