import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { Provider } from 'react-redux';
import store from '@store/index';

import { ApolloProvider } from '@apollo/client';
import { client } from '@/appollo-client';

import { SocketContext, socket } from '@/socket/socket';

import '../global.css'

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,                                         // fontFamily: 'Inter_400Regular'
    Inter_700Bold,                                            // fontFamily: 'Inter_700Bold'
    Aboreto: require('../assets/fonts/Aboreto-Regular.ttf'),  // fontFamily: 'Aboreto'
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  
  return (
    <View className='flex-1 bg-bgc'>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <SocketContext.Provider value={socket}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(main)" options={{ headerShown: false }} />
              <Stack.Screen name="(lobby)" options={{ headerShown: false }} />
              <Stack.Screen name="(game)" options={{ headerShown: false }} />
              
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="light" backgroundColor="#262626" />
          </SocketContext.Provider>
        </ApolloProvider>
      </Provider>
    </View>
  );
}
