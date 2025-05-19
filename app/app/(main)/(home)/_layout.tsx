import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { defaultHeaderOptions } from '@c/HeaderLayout';

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#262626' }}>
      <Stack screenOptions={defaultHeaderOptions}>
        <Stack.Screen name="Home" options={{ headerShown: false }} />
        <Stack.Screen name="JoinGameCode" options={{title: 'GAME CODE'}} />
        <Stack.Screen name="JoinQRCode" options={{title: 'QR CODE'}} />
      </Stack>
    </SafeAreaView>
  );
}
