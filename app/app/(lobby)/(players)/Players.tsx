import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

import QRCodeGenerator from '@c/QRCode';
import { useSocket } from '@/socket/socket';
import { AppDispatch } from '@/store';
import { lobbyUpdate } from '@/store/slices/gameSlice';

import Background from '@c/Background';
import ProfileIcon from '@img/ProfileIcon.svg';
import CrossIcon from '@img/CrossIcon.svg';

export default function PlayersScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const socket = useSocket();

  const gameCode = useSelector((state: any) => state.game.gameCode);
  const game = useSelector((state: any) => state.game);
  const players = useSelector((state: any) => state.game.players);
  const readyCount = players.filter((p: any) => p.ready).length;

  return (
    <View style={styles.container}>
      <Background />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>Game code</Text>
          <Text style={styles.codeValue}>{gameCode}</Text>
        </View>

        <View style={styles.qrWrapper}>
          <QRCodeGenerator gameCode={gameCode} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game master</Text>
          <PlayerItem player={{ username: game.gameMaster?.username || 'N/A', _id: null }} readonly />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Players <Text style={styles.subText}>({readyCount}/{players.length} ready)</Text>
          </Text>

          {game.roles?.map((role: any, i: number) => (
            <PlayersListByRole key={role.name} role={role} i={i} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const PlayersListByRole = ({ role, i }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket();
  const router = useRouter();

  const userId = useSelector((state: any) => state.auth.userId);
  const owner = useSelector((state: any) => state.game.owner);
  const gameCode = useSelector((state: any) => state.game.gameCode);
  const players = useSelector((state: any) => state.game.players);

  const handleLeaveLobby = (_id: any) => {
    socket?.emit('leave_lobby', { gameCode, _id });
    dispatch(
      lobbyUpdate({
        toChange: {
          players: players.filter((p: any) => p._id !== _id),
        },
        gameCode,
      })
    );
  };

  const changeRole = () => {
    const playersNew = [...players];
    const index = playersNew.findIndex((p: any) => p._id === userId);
    playersNew[index] = { ...playersNew[index], role: i };

    socket?.emit('lobby_update', {
      gameCode,
      toChange: { players: playersNew },
    });
    dispatch(
      lobbyUpdate({ toChange: { players: playersNew }, gameCode })
    );
  };

  return (
    <View style={styles.roleSection}>
      <TouchableOpacity onPress={changeRole}>
        <Text style={styles.roleTitle}>{role.name}s</Text>
      </TouchableOpacity>

      {players
        .filter((p: any) => p.role === i)
        .map((player: any) => (
          <PlayerItem
            key={player._id}
            player={player}
            isOwner={owner === userId}
            onKick={() => handleLeaveLobby(player._id)}
            onPress={() => router.push(`/(other)/Profile/${player._id}`)}
          />
        ))}
    </View>
  );
};

const PlayerItem = ({
  player,
  isOwner = false,
  onKick,
  onPress,
  readonly = false,
}: {
  player: any;
  isOwner?: boolean;
  onKick?: () => void;
  onPress?: () => void;
  readonly?: boolean;
}) => {
  return (
    <View style={styles.playerItem}>
      <TouchableOpacity onPress={onPress} disabled={readonly}>
        <View style={styles.playerInfo}>
          <ProfileIcon width={48} height={48} />
          <Text style={styles.playerName}>{player.username}</Text>
        </View>
      </TouchableOpacity>

      {isOwner && !readonly && (
        <TouchableOpacity onPress={onKick}>
          <CrossIcon width={24} height={24} />
        </TouchableOpacity>
      )}
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
    padding: 48,
    gap: 32,
  },
  codeSection: {
    alignItems: 'center',
    gap: 8,
  },
  codeLabel: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Aboreto',
  },
  codeValue: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'Aboreto',
  },
  qrWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: 'Aboreto',
    color: 'white',
  },
  subText: {
    fontSize: 16,
    color: '#999',
  },
  roleSection: {
    gap: 12,
  },
  roleTitle: {
    fontSize: 32,
    fontFamily: 'Aboreto',
    color: '#999',
  },
  playerItem: {
    width: 297,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playerName: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Aboreto',
    lineHeight: 24,
  },
});
