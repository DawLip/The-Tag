import { Tabs, Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TabLayout() {

  return (
    <SafeAreaView style={{flex: 1}} className='bg-bgc'>
      <Stack>
        <Stack.Screen name="Radar" options={{ headerShown: false }} />
        <Stack.Screen name="Hint" options={{ headerShown: false }} />
        <Stack.Screen name="GameOver-RunnersWin" options={{ headerShown: false }} />
        <Stack.Screen name="GameOver-SeekersWin" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
