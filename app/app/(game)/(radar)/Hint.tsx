import { Image, StyleSheet, Platform, View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';
import Background from '@c/Background';
export default function EventsScreen() {

  return (
    <View style={styles.container}>
      <Background/>
      <Skill label='zap' description='Zwiększa efektywność ścigającego poprzez przyspieszenie procesu złapania gracza' icon='zap' />
      <Skill label='tracker' description='Powoduje szybsze odświeżenie informacje o położeniu przeciwnika' icon='tracker' />
      <Skill label='orbital strike' description='Zaznacza tymczasowo strefę na mapie, do której nie wolno wchodzić żadnemu z graczy.' icon='orbital_strike' />
      <Skill label='invisibility' description='Umiejętność tworzy wokół gracza obszar niewidzialności, która uniemożliwia zobaczenia gracza na mapie.' icon='inviz' />
    </View>
  );
}

const Skill = ({label, description, icon}:{label:string, description:string, icon:string})=>{
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const gameCode = useSelector((state: any) => state.game.gameCode);
  const settings = useSelector((state: any) => state.game.settings);
  
  return (
    <View style={styles.row}>
      {icon=="inviz" && <Image source={require('@/assets/images/inviz.png')} style={{width:48, height:48}} />}
      {icon=="zap" && <Image source={require('@/assets/images/zap.png')} style={{width:48, height:48}} />}
      {icon=="orbital_strike" && <Image source={require('@/assets/images/orbital_strike.png')} style={{width:48, height:48}} />}
      {icon=="tracker" && <Image source={require('@/assets/images/tracker.png')} style={{width:48, height:48}} />}
  
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626', 
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16, 
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Aboreto',
    lineHeight: 20,
  },
  description: {
    color: '#929292',
    fontSize: 12,
    fontFamily: 'Aboreto',
    lineHeight: 16,
  },
});
