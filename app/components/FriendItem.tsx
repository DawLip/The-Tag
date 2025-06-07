import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProfileIcon from '@img/ProfileIcon.svg';
import UnfriendIcon from '@img/UnfriendIcon.svg';

export default function FriendItem({
  username,
  onRemove,
}: {
  username: string;
  onRemove: () => void;
}) {
  const [first, ...rest] = username.toUpperCase().split(' ');
  const secondLine = rest.join(' ');

  return (
    <View style={styles.container}>
      <View style={styles.userBlock}>
        <View style={styles.avatar}>
          <ProfileIcon width={48} height={48} />
        </View>
        <View>
          <Text style={styles.name}>{first}</Text>
          {secondLine ? <Text style={styles.name}>{secondLine}</Text> : null}
        </View>
      </View>

      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <UnfriendIcon width={40} height={40} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  name: {
    color: 'white',
    fontFamily: 'Aboreto',
    fontSize: 16,
    lineHeight: 24,
  },
  removeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
