import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>THE TAG</Text>
      <Logo className='flex-1' />
      <View>
        <Button label='LOG IN' onPress={()=>router.push('/(auth)/Login')}/>
        <Button label='PLAY AS GUEST' onPress={()=>router.push('/(auth)/AsGuest')}/>
        <Button label='Create account' variant="OUTLINE-WHITE" onPress={()=>router.push('/(auth)/Register')}/>
      </View>
    </View>
  );
}