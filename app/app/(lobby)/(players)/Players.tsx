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
  const game = useSelector((state: any) => state.game);

  return (
    <View className='flex-1 bg-bgc'>
      <View>
        <Text className='text-on_bgc'>Game Code:</Text>
        <Text className='text-on_bgc'>{gameCode}</Text>
      </View>
      <QRCodeGenerator text={gameCode} />
      <View>
        {game.roles?.map((role: any, i: number) => (
          <PlayersListByRole key={role.name} role={role} i={i} />
        ))}
      </View>
    </View>
  );
}

const PlayersListByRole = ({ role, i }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket();

  const userId = useSelector((state: any) => state.auth.userId);
  const owner = useSelector((state: any) => state.game.owner);
  const gameCode = useSelector((state: any) => state.game.gameCode);
  const players = useSelector((state: any) => state.game.players);

  const handleLeaveLobby = (_id: any) => {
    socket?.emit('leave_lobby', { gameCode, _id });
    dispatch(lobbyUpdate({ toChange: { players: players.filter((p: any) => p._id != _id) }, gameCode }))
  }

  const changeRole = (role: any) => {
    const playersNew = [...players];
    const index = playersNew.findIndex((player: any) => player._id === userId);
    playersNew[index] = { ...playersNew[index], role: role }

    socket?.emit('lobby_update', { gameCode: gameCode, toChange: { players: playersNew } })
    dispatch(lobbyUpdate({ toChange: { players: playersNew }, gameCode }))
  }

  return (
    <View>
      <TouchableOpacity onPress={()=>changeRole(i)}>
        <Text className='text-on_bgc' style={{ fontFamily: 'Aboreto' }}>{role.name}s</Text>
      </TouchableOpacity>
      {players.filter((player: any) => player.role == i).map((player: any) => (
        <View className='flex-row items-center gap-16'>
          <Text className='text-on_bgc'>name: {player.username} </Text>
          <Text className='text-on_bgc'>role: {player.role}</Text>
          {owner == userId &&
            <TouchableOpacity onPress={() => handleLeaveLobby(player._id)}>
              <Text className='text-on_bgc'>X</Text>
            </TouchableOpacity>
          }
        </View>
      ))}
    </View>
  );
}