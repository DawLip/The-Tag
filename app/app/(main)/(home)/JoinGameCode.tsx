import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import TextInput from '@c/inputs/TextInput'
import { useRouter } from 'expo-router';
import { useState } from 'react';

import Button from '@c/Button';

export default function JoinGameCodeScreen() {
  const router = useRouter();

  const [gamecode, setGamecode] = useState("");
  const joinLobby=()=>{
    router.replace('/(lobby)/(players)/Players')
  }

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>THE TAG</Text>
      <View>
        <TextInput label='Game code' placeholder='Enter Game Code' value={gamecode} setValue={setGamecode}/>
        <Button label='Join Now' onPress={joinLobby}/>
      </View>
    </View>
  );
}

