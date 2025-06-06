import { Image, StyleSheet, Platform, View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';

export default function EventsScreen() {
  const router = useRouter();
  const game = useSelector((state:any) => state.game)
  const userId = useSelector((state:any) => state.auth.userId)

  return (
    <View className='flex-1 bg-bgc'>
      <LabelInput label='Name' value={game.name} isInput={game.owner==userId} setting='name'/>
      <LabelInput label='Description' value={game.description} isInput={game.owner==userId} setting='description'/>
      <View>
        {game.roles.map((r:any, i:any)=>(
          <Text>{r.name}s: {game.players.filter((p:any)=>p.role==i).length}</Text>
        ))}
      </View>
    </View>
  );
}

const LabelInput = ({label, placeholder, value, setValue, isInput=false, setting=''}:{label:string, placeholder?:string, value:string, setValue?:(v:string)=>void, isInput?:boolean, setting?:string})=>{
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const gameCode = useSelector((state: any) => state.game.gameCode);
  const settings = useSelector((state: any) => state.game.settings);
  
  return (
    <View className='flex-row gap-4'>
      <Text>{label}:</Text>
      {isInput ?
        <TextInput 
          value={value}
          placeholder={placeholder}
          onChangeText={(e:any)=>{
            socket?.emit('lobby_update', {toChange:{[setting]:e}, gameCode})
            // setValue(e.target.value);
          }}
        />
        : <Text>{value}</Text>
      }
    </View>
  );
}