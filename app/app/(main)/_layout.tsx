import { Tabs, Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';


export default function TabLayout() {
  useAuth();

  return (
    <SafeAreaView style={{flex: 1}} className='bg-bgc'>
      <Tabs>
        <Tabs.Screen name="(create)" options={{ headerShown: false }} />
        <Tabs.Screen name="(home)" options={{ headerShown: false }} />
        <Tabs.Screen name="(settings)" options={{ headerShown: false }} />
      </Tabs>
    </SafeAreaView>
  );
}
