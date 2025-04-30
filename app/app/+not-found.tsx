import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { usePathname } from 'expo-router';

export default function NotFoundScreen() {
  const pathname = usePathname();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>404 - Not Found</Text>
      <Text style={{ marginTop: 10 }}>Nie znaleziono ścieżki:</Text>
      <Text style={{ color: 'gray' }}>{pathname}</Text>
    </View>
    </>
  );
}
