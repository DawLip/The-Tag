import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '@c/Button';
import Background from '@c/Background';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => { dispatch(logout()); router.push('/(auth)/Login'); };
  const userId = useSelector((state: any) => state.auth.userId);

  return (
    <View style={styles.container}>
      <Background />

      <View style={styles.menu}>
        <Pressable onPress={() => router.push(`/(other)/Profile/${userId}`)}>
          <Text style={styles.menuItem}>Profile</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(main)/(settings)/GamesHistory')}>
          <Text style={styles.menuItem}>GAMES HISTORY</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/(main)/(settings)/Account')}>
          <Text style={styles.menuItem}>ACCOUNT</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/(main)/(settings)/Add_friends')}>
          <Text style={styles.menuItem}>ADD FRIENDS</Text>
        </Pressable>
      </View>

      <View style={styles.logoutWrapper}>
        <Button
          label="LOGOUT"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    paddingHorizontal: 48,
    justifyContent: 'space-between',
    paddingBottom: 32,
    paddingTop: 64,
  },
  menu: {
    gap: 32,
    alignItems: 'center',
  },
  menuItem: {
    fontSize: 32,
    fontFamily: 'Aboreto',
    fontWeight: '400',
    lineHeight: 48,
    color: 'white',
  },
  logoutWrapper: {
    alignItems: 'center',
  },
});
