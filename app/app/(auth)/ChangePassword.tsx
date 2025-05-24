import { StyleSheet, View, Dimensions } from 'react-native';
import Background from '@c/Background';
import Button from '@c/Button';
import TextInput from '@c/inputs/TextInput';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { gql } from '@apollo/client';
import { queryGraphQL } from '@/utils/mutateGraphQL';

export default function HomeScreen() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [email, setEmail] = useState('');
  const [resetPasswordToken, setResetPasswordToken] = useState('');

  const changePassword = async () => {
    const RESET_PASSWORD = gql`
    mutation changePasswordViaEmail($input: ChangePassowordViaEmailInput!) {
      changePasswordViaEmail(input: $input) {
        status
      }
    }
  `;

    const {changePasswordViaEmail} = await queryGraphQL(RESET_PASSWORD, {input: {email,resetPasswordToken,newPassword:password}}, "")
    console.log(changePasswordViaEmail)
    if(changePasswordViaEmail.status == "SUCCESS") router.push('/(auth)/Login')
    else return;
  }

  return (
    <View style={styles.container}>
      <Background />

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <TextInput
            label="Email"
            value={email}
            setValue={setEmail}
          />
          <TextInput
            label="Reset password token"
            value={resetPasswordToken}
            setValue={setResetPasswordToken}
            // isPassword
          />
          <TextInput
            label="New password"
            value={password}
            setValue={setPassword}
            // isPassword
          />

          <TextInput
            label="Repeat password"
            value={repeatPassword}
            setValue={setRepeatPassword}
            // isPassword
          />
        </View>

        <Button
          label="Change Password"
          onPress={changePassword}
          textStyle={{ fontSize: 20 }}
          // style={{ marginTop: 24 }}
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
    zIndex: 3,
    alignItems: 'stretch',
  },
  inputGroup: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
  },
});
