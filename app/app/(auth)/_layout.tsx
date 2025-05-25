import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Pressable, View, Text, StyleSheet } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import ArrowIcon from '@img/ArrowIcon.svg';

export default function TabLayout() {
  useAuth(true);
  const router = useRouter();

  const renderHeader = (title: string) => (
    <View style={styles.header}>
      <Pressable style={styles.iconWrapper} onPress={() => router.back()}>
        <ArrowIcon />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#262626' }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen
          name="Login"
          options={{
            header: () => renderHeader('Login'),
          }}
        />
        <Stack.Screen
          name="Register"
          options={{
            header: () => renderHeader('Register'),
          }}
        />
        <Stack.Screen
          name="AsGuest"
          options={{
            header: () => renderHeader('Continue as Guest'),
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          options={{
            header: () => renderHeader('Change Password'),
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{
            header: () => renderHeader('Forgot Password'),
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#343437',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Aboreto',
    fontWeight: '400',
    lineHeight: 22,
  },
});
