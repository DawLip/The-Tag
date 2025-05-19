import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import ArrowIcon from '@img/ArrowIcon.svg';
import { useRouter } from 'expo-router';

export const HeaderLeft = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{ paddingHorizontal: 8 }}
    >
      <View style={{ width: 24, height: 24 }}>
        <ArrowIcon width="100%" height="100%" />
      </View>
    </TouchableOpacity>
  );
};

export const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: '#343437',
    height: 60,
  },
  headerTitleStyle: {
    fontFamily: 'Aboreto',
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerTintColor: 'transparent',
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerLeft: () => <HeaderLeft />,
};
