import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';

import Logo from '@img/Logo.svg';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { queryGraphQL } from '@/utils/mutateGraphQL';
import { client } from '@/appollo-client';
import { useSelector } from 'react-redux';

export default function GamesHistoryScreen() {
  const router = useRouter();
  const [historyData, setHistoryData] = useState<any>();

  const userId = useSelector((state: any) => state.auth.userId);
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const GAMES = gql`
      query games($userId: ID!) {
        games( userId: $userId ) {
          _id
          name
          description
          status
          gameCode
          rules
          roles
          settings
          events
          owner {
            _id
            username
          }
          gameMaster {
            username
          }
          players {
            role
          }
        }
      }
    `;

    const fetchData = async () => {
      const data = await queryGraphQL(GAMES, { userId: userId }, token)
      console.log(data)
      setHistoryData(data.games);
    };

    fetchData();
  }, [client]);

  return (
    <View className='flex-1 bg-bgc'>
      { historyData&&historyData?.map((historyDataItem:any)=>(<GameHistoryItem historyDataItem={historyDataItem}/>))

      }
    </View>
  );
}

const GameHistoryItem = ({ historyDataItem}:{historyDataItem:any}) => {
  return (
    <View>
      {historyDataItem.name}
    </View>
  );
}

