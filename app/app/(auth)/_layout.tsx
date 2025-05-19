import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { defaultHeaderOptions } from '@c/HeaderLayout';

export default function TabLayout() {
  useAuth(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#262626' }}>
      <Stack screenOptions={defaultHeaderOptions}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ title: 'LOGIN' }} />
        <Stack.Screen name="Register" options={{ title: 'REGISTER' }} />
        <Stack.Screen name="AsGuest" options={{ title: 'JOIN GAME' }} />
        <Stack.Screen name="ChangePassword" options={{ title: 'NEW PASSWORD' }} />
        <Stack.Screen name="ForgotPassword" options={{ title: 'RESET PASSWORD' }} />
      </Stack>
    </SafeAreaView>
  );
}
