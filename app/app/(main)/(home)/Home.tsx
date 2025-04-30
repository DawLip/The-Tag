import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>THE TAG</Text>
      <View>
        <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>Join game by</Text>
        <View>
          <Button label="Game Code" onPress={()=>router.push('/(main)/(home)/JoinGameCode')}/>
          <Button label="QR Code" onPress={()=>router.push('/(main)/(home)/JoinQRCode')}/>
        </View>
      </View>
    </View>
  );
}

