import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '@/store/thunks/auth/loginThunk';
import { setError } from '@/store/slices/authSlice';
import type { AppDispatch } from '@store/index';

import Button from '@c/Button';
import TextInput from '@c/inputs/TextInput';
import AssistiveChip from '@c/AssistiveChip';
import Background from '@c/Background';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: any) => state.auth.token);
  const error = useSelector((state: any) => state.auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassowrd] = useState('');

  useEffect(() => { dispatch(setError('')) }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#262626" />

      <View style={styles.container}>
        <Background />

        <View style={styles.content}>
          <View style={styles.inputSection}>
            <TextInput
              label="Email"
              value={email}
              placeholder="Your email"
              setValue={setEmail}
            />
            <TextInput
              label="Password"
              value={password}
              placeholder="Password"
              setValue={setPassowrd}
              isPassword={true}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.buttonGroup}>
            <Button
              label="LOG IN"
              onPress={() => dispatch(loginThunk({ email, password }))}
              textStyle={{ fontSize: 20 }}
            />
            <AssistiveChip
              label="Forgot password"
              variant="OUTLINE-WHITE"
              onPress={() => router.push('/(auth)/ForgotPassword')}
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#262626',
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 297,
    zIndex: 3,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  inputSection: {
    width: 297,
    height: 164,
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 12,
    marginTop: 75,
  },
  buttonGroup: {
    width: 297,
    height: 144,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 0,
    marginTop: 48,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 16,
  },
});
