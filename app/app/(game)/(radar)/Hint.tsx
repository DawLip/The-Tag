import { Image, StyleSheet, Platform, View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';

export default function EventsScreen() {

  return (
    <View className='flex-1 bg-bgc'>
      <Skill label='zap' description='description' icon='zap' />
      <Skill label='tracker' description='description' icon='tracker' />
      <Skill label='orbital strike' description='description' icon='orbital_strike' />
      <Skill label='invisibility' description='description' icon='inviz' />
    </View>
  );
}

const Skill = ({label, description, icon}:{label:string, description:string, icon:string})=>{
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const gameCode = useSelector((state: any) => state.game.gameCode);
  const settings = useSelector((state: any) => state.game.settings);
  
  return (
    <View className='flex-row gap-4'>
      {icon=="inviz" && <Image source={require('@/assets/images/inviz.png')} style={{width:48, height:48}} />}
      {icon=="zap" && <Image source={require('@/assets/images/zap.png')} style={{width:48, height:48}} />}
      {icon=="orbital_strike" && <Image source={require('@/assets/images/orbital_strike.png')} style={{width:48, height:48}} />}
      {icon=="tracker" && <Image source={require('@/assets/images/tracker.png')} style={{width:48, height:48}} />}

      <View>
        <Text>{label}</Text>
        <Text>{description}</Text>
      </View>
    </View>
  );
}