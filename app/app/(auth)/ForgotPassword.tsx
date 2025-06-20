import { StyleSheet, View, Dimensions } from 'react-native';
import Background from '@c/Background';
import Button from '@c/Button';
import TextInput from '@c/inputs/TextInput';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { queryGraphQL } from '@/utils/mutateGraphQL';
import { useSelector } from 'react-redux';
import { gql } from '@apollo/client';


export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);


  const resetPassword = () => {
    const RESET_PASSWORD = gql`
      mutation resetPassword($email: String!) {
        resetPassword(email: $email) {
          status
        }
      }
    `;

    queryGraphQL(RESET_PASSWORD, {email: email}, token)
    router.push('/(auth)/ChangePassword')
  }

  return (
    <View style={styles.container}>
      <Background />

      <View style={styles.content}>
        <TextInput
          label="Email"
          value={email}
          placeholder="Your email"
          setValue={setEmail}
        />

        <Button
        
          label="Send email"
          onPress={resetPassword}
          textStyle={{ fontSize: 20 }}
        
        />
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  content: {
    width: 297,
    zIndex: 3,
    justifyContent: 'center',
    gap:24,
  },
});
