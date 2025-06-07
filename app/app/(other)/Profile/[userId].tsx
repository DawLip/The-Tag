import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { queryGraphQL } from '@/utils/mutateGraphQL';

import ProfileIcon from '@img/ProfileIcon.svg';
import FriendItem from '@c/FriendItem';

export default function ProfileScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { userId } = useLocalSearchParams();
  const token = useSelector((state: any) => state.auth.token);

  const [userData, setUserData] = useState<any>({});

  const FRIENDS = gql`
    query user($_id: ID!) {
      user(input: { _id: $_id }) {
        username
        email
        friends {
          _id
          username
        }
      }
    }
  `;

  const REMOVE_FRIEND = gql`
    mutation removeFriend($userId: ID!, $friendId: ID!) {
      removeFriend(input: { userId: $userId, friendId: $friendId }) {
        status
      }
    }
  `;

  const fetchUserData = async () => {
    const data = await queryGraphQL(FRIENDS, { _id: userId }, token);
    setUserData(data.user);

    if (data?.user?.username) {
      router.setOptions({ title: data.user.username });
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await queryGraphQL(REMOVE_FRIEND, { userId, friendId }, token);
      fetchUserData(); 
    } catch (err) {
      console.warn('Failed to remove friend:', err);
    }
  };

  const accountHeaderStats = [
    { label: 'Friends', value: userData?.friends?.length || 0 },
    { label: 'Games', value: 10 },
    { label: 'Wins', value: 2 },
  ];

  const accountStats = [
    { label: 'Time in game', value: '16h 23min' },
    { label: 'Account since', value: '17.05.2025' },
    { label: 'Played games', value: '36' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: userData?.username?.toUpperCase() || '',
          headerStyle: { backgroundColor: '#343437' },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontFamily: 'Aboreto',
            fontSize: 24,
          },
        }}
      />
      <SafeAreaView style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerWrapper}>
            <View style={styles.avatarContainer}>
              <ProfileIcon width={133} height={127} />
            </View>
            <View style={styles.statsRow}>
              {accountHeaderStats.map((stat) => (
                <AccountHeaderStats
                  key={`AccountHeaderStats-${stat.label}`}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </View>
          </View>

          <View style={styles.accountStatsWrapper}>
            {accountStats.map((stat) => (
              <AccountStats
                key={`AccountStats-${stat.label}`}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </View>

          <View style={styles.friendsSection}>
            <Text style={styles.friendsTitle}>FRIENDS</Text>
            <View style={styles.friendList}>
              {userData?.friends?.map((friend: any) => (
                <FriendItem
                  key={friend._id}
                  username={friend.username}
                  onRemove={() => handleRemoveFriend(friend._id)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const AccountHeaderStats = ({ value, label }: { value: number; label: string }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AccountStats = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.accountStatRow}>
    <Text style={styles.accountStatLabel}>{label}</Text>
    <Text style={styles.accountStatValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#262626',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    flexGrow: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 133,
    height: 127,
    marginLeft: -20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    paddingRight: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  statLabel: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 16,
    marginTop: 4,
  },
  accountStatsWrapper: {
    marginTop: 24,
    paddingHorizontal: 8,
    gap: 8,
  },
  accountStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingRight: 27,
  },
  accountStatLabel: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter',
  },
  accountStatValue: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Aboreto',
  },
  friendsSection: {
    marginTop: 32,
    paddingBottom: 80,
    paddingRight: 27,
  },
  friendsTitle: {
    fontSize: 32,
    fontFamily: 'Aboreto',
    color: 'white',
    marginBottom: 16,
  },
  friendList: {
    gap: 16,
  },
});
