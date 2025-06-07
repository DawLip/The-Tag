import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';
import { useSelector } from 'react-redux';
import { useSocket } from '@/socket/socket';

export default function LogsScreen() {
  const router = useRouter();
  const socket = useSocket();
  const logs = useSelector((state: any) => state.game.gameLogs);
  const gameCode = useSelector((state:any) => state.game.gameCode)
  const userId = useSelector((state:any) => state.auth.userId)
  
  console.log("logs: ", logs);
  return (
    <View className='flex-1 bg-bgc'>
      <Button label='nowy log' onPress={()=>{
      socket?.emit('game_update',{gameCode, userId, toChange:{logName:"nowy log"}})
    }}/>
      {logs.map((log:any)=><LogItem log={log}/>)}
    </View>
  );
}

const LogItem = ({log}:{log:any}) => {
  return (
  <View>
    <Text>{formatDate(log.date)}</Text>
    <Text>{log.name}</Text>
    <Text>Players: {log.playersRemaining}</Text>
    <Text>Your role: {log.yourRole}</Text>
  </View>
  );
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}:${month}:${year} ${hours}:${minutes}:${seconds}`;
}

