// import React, { useState } from 'react';
// import { StyleSheet, View, Text } from 'react-native';
// import { useRouter } from 'expo-router';

// import { useDispatch } from 'react-redux';
// import { useSocket } from '@/socket/socket';
// import { AppDispatch } from '@/store';

// import TextInput from '@c/inputs/TextInput';
// import Button from '@c/Button';
// import { joinLobby } from '@/store/slices/gameSlice';
// import Background from '@c/Background';

// export default function JoinGameCodeScreen() {
//   const router = useRouter();
//   const socket = useSocket();
//   const dispatch = useDispatch<AppDispatch>();


//   const [gameCode, setGameCode] = useState("");

//   const handleJoinLobby=()=>{
//     console.log('=== Join lobby ===');
//     socket?.emit('join_lobby', { gameCode }, (response: any) => {
//       if (response.status !== 'SUCCESS') console.error('Error joining lobby:', response.status,response.message);
//       console.log('Joined successfully:', response);
      
//       dispatch(joinLobby(response.game));
//       router.push('/(lobby)/(players)/Players');
//     });
//     router.replace('/(lobby)/(players)/Players')
//   }

//   return (
//     <View style={styles.container}>
//       <Background />

//       <Text style={styles.title}>THE TAG</Text>

//       <View style={styles.form}>
//         <TextInput
//           label="Game code"
//           placeholder="Enter Game Code"
//           value={gameCode}
//           setValue={setGameCode}
//         />
//         <Button label="Join Now" onPress={handleJoinLobby} />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#262626',
//     paddingTop: 50,
//     paddingHorizontal: 48,
//     paddingBottom: 0, 
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     gap: 32,
//     position: 'relative', 
//     zIndex: 2, 
//   },
//   title: {
//     fontFamily: 'Aboreto',
//     fontSize: 64,
//     color: '#FFFFFF',
//     textShadowColor: 'rgba(0, 0, 0, 0.25)',
//     textShadowOffset: { width: 0, height: 4 },
//     textShadowRadius: 4,
//     marginBottom: 16,
//   },
//   section: {
//     fontFamily: 'Aboreto',
//     fontSize: 18,
//     color: '#FFFFFF',
//   },
//   form: {
//     width: '100%',
//     gap: 16,
//     alignItems: 'center',
//   },
// });
