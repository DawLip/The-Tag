import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';
import { useEffect } from 'react';

export default function PlayersScreen() {
  const router = useRouter();

  const gameCode = useSelector((state: any) => state.game.gameCode);
  const players = useSelector((state: any) => state.game.players);
  const game = useSelector((state: any) => state.game);
  console.log(game)

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>THE TAG</Text>
      <View>
        <Text className='text-on_bgc'>Game Code:</Text>
        <Text className='text-on_bgc'>{gameCode}</Text>
      </View>
      <View>
        <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>Players</Text>
        {players?.map((player: any) => (
          <View key={player._id} className='flex-row items-center'>
            <Text className='text-on_bgc'>name: {player.username} </Text>
            <Text className='text-on_bgc'>role: {player.role}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

