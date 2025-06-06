import { Image, StyleSheet, Platform, View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { client } from '@/appollo-client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { mutateGraphQL, queryGraphQL } from '@/utils/mutateGraphQL';

export default function ProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  console.log(userId)
  let token = useSelector((state:any) => state.auth.token)
  const thisUserId = useSelector((state:any) => state.auth.userId)

  const [userData, setUserData] = useState<any>({});

  // if(token=="") token = localStorage.getItem('token');
  // else localStorage.setItem('token', token);
  
  console.log(token)

  const accountHeaderStats = [
    { label: 'Friends', value: userData?.friends?.length || 0 },
    { label: 'Games', value: 10 },
    { label: 'Wins', value: 2 },
  ]

  const accountStats = [
    { label: 'Time in game', value: "16h 23min" },
    { label: 'Account since', value: "17.05.2025" },
    { label: 'Played games', value: "36" },
  ]

  useEffect(() => {
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

    const fetchFriends = async () => {
      const data = await queryGraphQL(FRIENDS, { _id: userId }, token)
      console.log(data.user)
      setUserData(data.user);
    };

    fetchFriends();
  }, [client]);

  const addFriend = async () => {
    const ADD_FRIENDS = gql`
      mutation inviteFriend($userId: ID!, $friendId: ID!) {
        inviteFriend(input: { userId: $userId, friendId: $friendId }) {
          status
    }}`;
    
    const data = await mutateGraphQL(ADD_FRIENDS, { userId: thisUserId, friendId: userId })
    console.log(data.user)
  }


  return (
    <View className='flex-1 bg-bgc'>
      <View>
        <View>
          <Image />
        </View>
        <View>
          <View>{accountHeaderStats.map(stat => <AccountHeaderStats key={`AccountHeaderStats-${stat.label}`} label={stat.label} value={stat.value} />)}</View>
          <View>
            <TouchableOpacity onPress={addFriend}><Text>ADD FRIEND</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <View>{accountStats.map(stat => <AccountStats key={`AccountStats-${stat.label}`} label={stat.label} value={stat.value} />)}</View>

      <View>
        <View><Text>Friends</Text></View>
        <View>
          {userData?.friends?.map((friend:any)=><View>{friend.username}</View>)}
        </View>
      </View>
    </View>
  );
}

const AccountHeaderStats = ({ value, label }: { value: number, label: string }) => {
  return (
    <View>
      <View><Text>{value}</Text></View>
      <View><Text>{label}</Text></View>
    </View>
  );
}

const AccountStats = ({ value, label }: { value: string, label: string }) => {
  return (
    <View>
      <View><Text>{value}</Text></View>
      <View><Text>{label}</Text></View>
    </View>
  );
}
