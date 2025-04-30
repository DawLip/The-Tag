import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';

export default function StatistictsScreen() {
  const router = useRouter();

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>Statistics</Text>
      
    </View>
  );
}

