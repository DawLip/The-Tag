import { Tabs, Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  useAuth(true);

  return (
    <SafeAreaView style={{flex: 1}} className='bg-bgc'>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{}} />
        <Stack.Screen name="Register" options={{}} />
        <Stack.Screen name="AsGuest" options={{}} />
        <Stack.Screen name="ChangePassword" options={{}} />
        <Stack.Screen name="ForgotPassword" options={{}} />
      </Stack>
    </SafeAreaView>
  );
}
