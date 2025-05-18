import { Image, StyleSheet, Platform, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@c/Button';
import QRCodeGenerator from '@c/QRCode';
import { useEffect } from 'react';
import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';
import { lobbyUpdate } from '@/store/slices/gameSlice';


export default function PlayersScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const socket = useSocket();

  const gameCode = useSelector((state: any) => state.game.gameCode);
  const players = useSelector((state: any) => state.game.players);
  const game = useSelector((state: any) => state.game);
  const userId = useSelector((state: any) => state.auth.userId);

  const changeRole = (role:any) => {
    const playersNew = [...players];
    const index = playersNew.findIndex((player: any) => player._id === userId);
    playersNew[index] = { ...playersNew[index], role: role}

    socket?.emit('lobby_update', {gameCode: gameCode, toChange:{players:playersNew}})
    dispatch(lobbyUpdate({toChange:{players:playersNew}, gameCode}))
  }

  return (
    <View className='flex-1 bg-bgc'>
      <View>
        <Text className='text-on_bgc'>Game Code:</Text>
        <Text className='text-on_bgc'>{gameCode}</Text>
      </View>
      <QRCodeGenerator text={gameCode} />
      <View>
        {game.roles?.map((role:any, i: number) => (
          <PlayersListByRole key={role.name} role={role} i={i} changeRole={()=>changeRole(i)}/>
        ))}
      </View>
    </View>
  );
}

const PlayersListByRole = ({role, i, changeRole}:any) => {
  const players = useSelector((state: any) => state.game.players);

  return (
    <View>
      <TouchableOpacity onPress={changeRole}>
        <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>{role.name}s</Text>
      </TouchableOpacity>
      {players.filter((player:any)=>player.role==i).map((player:any)=>(
        <View className='flex-row items-center'>
          <Text className='text-on_bgc'>name: {player.username} </Text>
          <Text className='text-on_bgc'>role: {player.role}</Text>
        </View>
      ))}
    </View>
  );
}