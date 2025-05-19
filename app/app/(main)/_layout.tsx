import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Feather, AntDesign } from '@expo/vector-icons';

export default function TabLayout() {
  useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#262626' }}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#262626',
            height: 64,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontFamily: 'Aboreto',
            fontSize: 12,
          },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#636363',
          tabBarItemStyle: {
            width: 131, 
            height: 64,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            borderLeftWidth: route.name !== '(create)' ? 1 : 0,
            borderLeftColor: '#343437',
          },
        })}
      >
        <Tabs.Screen
          name="(create)"
          options={{
            tabBarLabel: 'CREATE',
            tabBarIcon: ({ color }) => (
              <Feather name="crosshair" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarLabel: 'HOME',
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(settings)"
          options={{
            tabBarLabel: 'SETTINGS',
            tabBarIcon: ({ color }) => (
              <Feather name="settings" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
