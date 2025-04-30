import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>Settings</Text>
      <View>
        <Button label="Leave game" onPress={()=>router.replace('/(main)/(home)/Home')} />
      </View>
    </View>
  );
}

