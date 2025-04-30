import { Tabs, Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TabLayout() {

  return (
    <SafeAreaView style={{flex: 1}} className='bg-bgc'>
      <Stack>
        <Stack.Screen name="Settings" options={{ headerShown: false }} />

        <Stack.Screen name="Account" options={{}} />
        <Stack.Screen name="Friends" options={{}} />
        <Stack.Screen name="GamesHistory" options={{}} />
        <Stack.Screen name="Statistics" options={{}} />
      </Stack>
    </SafeAreaView>
  );
}
