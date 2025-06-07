import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useSelector } from 'react-redux';
import { queryGraphQL, mutateGraphQL } from '@/utils/mutateGraphQL';

import ProfileIcon from '@img/ProfileIcon.svg';
import AddFriendIcon from '@img/UnfriendIcon.svg';
import Background from '@c/Background';

export default function AddFriendsScreen() {
  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);
  const currentUserId = useSelector((state: any) => state.auth.userId);

  const [userData, setUserData] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [find, setFind] = useState('');

  const USERS_QUERY = gql`
    query {
      users {
        username
        _id
      }
    }
  `;

  const INVITE_FRIEND = gql`
    mutation inviteFriend($userId: ID!, $friendId: ID!) {
      inviteFriend(input: { userId: $userId, friendId: $friendId }) {
        status
      }
    }
  `;

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await queryGraphQL(USERS_QUERY, {}, token);
      setUserData(data.users);
      setFilteredUsers(data.users);
    };

    fetchUsers();
  }, []);

  const handleSearch = (text: string) => {
    setFind(text);
    setFilteredUsers(
      userData.filter((user) =>
        user.username.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const handleAddFriend = async (friendId: string) => {
    try {
      await mutateGraphQL(
        INVITE_FRIEND,
        { userId: currentUserId, friendId },
        token
      );
    } catch (error) {
      console.error('Add friend failed', error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Background />

      <SafeAreaView style={styles.content}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={find}
              placeholder="Find friends"
              placeholderTextColor="#A0A0A0"
              onChangeText={handleSearch}
            />
            <View style={styles.inputIcon}>
              <AddFriendIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.list}>
            {filteredUsers.map((user) => (
              <View key={user._id} style={styles.userItem}>
                <TouchableOpacity
                  style={styles.userLeft}
                  onPress={() => router.push(`/(other)/Profile/${user._id}`)}
                >
                  <View style={styles.avatar}>
                    <ProfileIcon width={48} height={48} />
                  </View>
                  <View>
                    <Text style={styles.username}>
                      {user.username?.split(' ')[0]}
                    </Text>
                    {user.username?.split(' ')[1] && (
                      <Text style={styles.username}>
                        {user.username?.split(' ').slice(1).join(' ')}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddFriend(user._id)}
                >
                  <AddFriendIcon width={40} height={40} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#262626',
  },
  content: {
    flex: 1,
  },
  scroll: {
    paddingTop: 48,
    paddingHorizontal: 24,
    gap: 20,
  },
  inputContainer: {
    width: 293,
    backgroundColor: '#636363',
    borderRadius: 20,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  input: {
    color: 'white',
    fontFamily: 'Aboreto',
    fontSize: 16,
    flex: 1,
    paddingLeft: 12,
  },
  inputIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    gap: 16,
    paddingBottom: 48,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#636363',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    color: 'white',
    fontFamily: 'Aboreto',
    fontSize: 16,
    lineHeight: 24,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
