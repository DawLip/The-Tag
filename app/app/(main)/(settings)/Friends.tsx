import { Image, StyleSheet, Platform, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useEffect, useState } from 'react';
import { mutateGraphQL, queryGraphQL } from '@/utils/mutateGraphQL';
import { client } from '@/appollo-client';
import { useSelector } from 'react-redux';
import { gql } from '@apollo/client';

export default function FriendsScreen() {
  const router = useRouter();
  const token = useSelector((state:any) => state.auth.token)
  const userId = useSelector((state:any) => state.auth.userId)

  const [userData, setUserData] = useState<any>({});



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

  const removeFriend = async (friendId:any)=>{
    const ADD_FRIENDS = gql`
      mutation removeFriend($userId: ID!, $friendId: ID!) {
        removeFriend(input: { userId: $userId, friendId: $friendId }) {
          status
    }}`;
    
    const data = await mutateGraphQL(ADD_FRIENDS, { userId: userId, friendId: friendId })
    console.log(data.user)
    setUserData((prev:any)=>({...prev, friends:[...prev.friends.filter((f:any)=>f._id!==friendId)]}))
  }

  return (
    <View className='flex-1 bg-bgc'>
      <Text className='text-on_bgc' style={{fontFamily: 'Aboreto'}}>Friends</Text>
      <View>
        {userData?.friends?.map((friend:any)=>(
          <View className='flex-row gap-2'>
            <Text>{friend.username}</Text>
            <TouchableOpacity onPress={()=>removeFriend(friend._id)}><Text>X</Text></TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

function setUserData(user: any) {
  throw new Error('Function not implemented.');
}

