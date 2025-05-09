import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import ArrowIcon from '@img/ArrowIcon.svg';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  useAuth(true);
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#262626' }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#343437',
           
          },
          headerTitleStyle: {
            fontFamily: 'Aboreto',
            fontSize: 24,
            color: '#FFFFFF',
          },
          headerTintColor: 'transparent',
          headerBackTitleVisible: false,
          headerShadowVisible: false, 
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingHorizontal: 16 }}
            >
              <ArrowIcon width={32} height={32} />
            </TouchableOpacity>
          ),
        }}
      >
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
