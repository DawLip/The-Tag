import { StyleSheet, View, Dimensions } from 'react-native';
import Background from '@c/Background';
import Button from '@c/Button';
import TextInput from '@c/inputs/TextInput';
import { useState } from 'react';
import { useRouter } from 'expo-router';


export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Background />

      <View style={styles.content}>
        <TextInput
          label="Email"
          value={email}
          placeholder="Your email"
          setValue={setEmail}
        />

        <Button
        
          label="Send email"
          onPress={() => router.push('/(auth)/ChangePassword')}
          textStyle={{ fontSize: 20 }}
        
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
    justifyContent: 'center',
    gap:24,
  },
});
