import { Image, StyleSheet, Platform, View, Text, TouchableHighlight, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';
import { useSocket } from '@/socket/socket';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { gameStarted, lobbyUpdate } from '@/store/slices/gameSlice';
import { login } from '@store/slices/authSlice';
import { useState } from 'react';

export default function LobbySettingsScreen() {
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  const [saveTime, setSaveTime] = useState(5);

  const gameCode = useSelector((state: any) => state.game.gameCode);
  const settings = useSelector((state: any) => state.game.settings);

  const settingsNames = [
    {name: 'saveTime', label: 'Save time (min):'}, 
    {name: 'gameTime', label: 'Game time (min):'}, 
    {name: 'posInterval', label: 'Position uppdate interval (s):'}
  ];

  const handleStartGame = () => {
    console.log('=== Start game ===');
    socket?.emit('start_game', {gameCode}, (response: any) => {console.log('Game started successfully:', response);})
    dispatch(gameStarted({}));
    router.replace('/(game)/(radar)/Radar');
  }

  const setSetting = (e:any, settingName:string) => {
    socket?.emit('lobby_update', {toChange:{settings:{...settings, [settingName]:e}}, gameCode})
  }

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>Settings</Text>
      <View>
        { settingsNames.map(settingName=>(
          <NumInput label={settingName.label} value={settings[settingName.name]} setValue={(e:any)=>setSetting(e, settingName.name)}/>
        ))}
      </View>
      <Button label="Start game" onPress={handleStartGame}/>
    </View>
  );
}

const NumInput = ({label, value, placeholder='-', setValue}:any) => {
  return (
    <View className='flex flex-row text-white'>
      <Text className='text-white'>{label}</Text>
      <TextInput 
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        onChangeText={setValue}
      />
    </View>
  );
}

