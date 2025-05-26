import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ArrowIcon from '@img/ArrowIcon.svg';
export default function TabLayout() {
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
        <Stack.Screen name="Settings" options={{ headerShown: false }} />

        <Stack.Screen
          name="Account"
          options={{ header: () => renderHeader('ACCOUNT') }}
        />
        <Stack.Screen
          name="Friends"
          options={{ header: () => renderHeader('FRIENDS') }}
        />
        <Stack.Screen
          name="GamesHistory"
          options={{ header: () => renderHeader('GAMES HISTORY') }}
        />
        <Stack.Screen
          name="Statistics"
          options={{ header: () => renderHeader('STATISTICS') }}
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

