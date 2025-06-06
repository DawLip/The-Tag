import { Image, StyleSheet, Platform, View, Text, TouchableOpacity, TextInput } from 'react-native';
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

  const [userData, setUserData] = useState<any>([]);
  const [userDataToRender, setUserDataToRender] = useState<any>([]);
  const [find, setFind] = useState<any>("");

  useEffect(() => {
    const FRIENDS = gql`
      query {
        users {
          username
          _id
        }
      }
    `;

    const fetchFriends = async () => {
      const data = await queryGraphQL(FRIENDS, {}, token)
      console.log(data.users)
      setUserData(data.users);
      setUserDataToRender(data.users);
    };

    fetchFriends();
  }, [client]);
console.log(userData)

  return (
    <View className='flex-1 bg-bgc'>
      <TextInput
        value={find}
        placeholder={"Find friends"}
        placeholderTextColor="#A0A0A0"
        onChangeText={(e:any)=>{
          setFind(e);
          setUserDataToRender(userData.filter((d:any)=>d.username.includes(e)));
        }}
      />
      <View>
        {userDataToRender?.map((friend:any)=>(
          <TouchableOpacity onPress={()=>router.push(`/(other)/Profile/${userId}`)} className='flex-row gap-2'>
            <Text>{friend.username}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function setUserData(user: any) {
  throw new Error('Function not implemented.');
}

