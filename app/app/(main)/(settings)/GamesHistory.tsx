import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { gql } from '@apollo/client';
import { queryGraphQL } from '@/utils/mutateGraphQL';
import { client } from '@/appollo-client';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

import Background from '@c/Background';

export default function GamesHistoryScreen() {
  const router = useRouter();
  const [historyData, setHistoryData] = useState<any>();

  const userId = useSelector((state: any) => state.auth.userId);
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const GAMES = gql`
      query games($userId: ID!) {
        games(userId: $userId) {
          _id
          name
          createdAt
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
    <View style={styles.container}>
      <Background />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {historyData &&
          historyData.map((historyDataItem: any) => (
            <GameHistoryItem key={historyDataItem._id} historyDataItem={historyDataItem} />
          ))}
      </ScrollView>
    </View>
  );
}

const GameHistoryItem = ({ historyDataItem }: { historyDataItem: any }) => {
  const formattedDate = historyDataItem.createdAt
    ? new Date(historyDataItem.createdAt).toLocaleDateString('pl-PL')
    : 'brak daty';

  return (
    <View style={styles.gameContainer}>
      <Text style={styles.dateText}>{formattedDate}</Text>
      <Text style={styles.titleText}>{historyDataItem.name}</Text>
      <View style={styles.inlineRow}>
        <Text style={styles.grayText}>Game master:</Text>
        <Text style={styles.grayText}>
          {historyDataItem?.gameMaster?.username || 'brak'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    position: 'relative',
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 48,
    paddingHorizontal: 48,
  },
  gameContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    display: 'flex',
  },
  dateText: {
    color: '#929292',
    fontSize: 12,
    fontFamily: 'Aboreto',
    fontWeight: '400',
    lineHeight: 12,
  },
  titleText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Aboreto',
    fontWeight: '400',
    lineHeight: 16,
  },
  inlineRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 4,
  },
  grayText: {
    color: '#929292',
    fontSize: 12,
    fontFamily: 'Aboreto',
    fontWeight: '400',
    lineHeight: 12,
  },
});
