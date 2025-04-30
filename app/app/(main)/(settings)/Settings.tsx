import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>Settings</Text>
      <View>
        <Button label='Games History' onPress={()=>router.push('/(main)/(settings)/GamesHistory')}/>
        <Button label='Statistics' onPress={()=>router.push('/(main)/(settings)/Statistics')}/>
        <Button label='Friends' onPress={()=>router.push('/(main)/(settings)/Friends')}/>
        <Button label='Account' onPress={()=>router.push('/(main)/(settings)/Account')}/>
        <Button label='Logout' onPress={() => dispatch(logout())}/>
      </View>
    </View>
  );
}

