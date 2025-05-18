import { Image, StyleSheet, Platform, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { client } from '@/appollo-client';


import Button from '@c/Button';
import ArrowRight from '@img/arrow-right.svg';
import ArrowDown from '@img/arrow-down.svg';
import TextInput from '@c/inputs/TextInput';

import Logo from '@img/Logo.svg';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { mutateGraphQL } from '@/utils/mutateGraphQL';

export default function AccountScreen() {
  const router = useRouter();

  const userID = useSelector((state: any) => state.auth.userId);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordR, setNewPasswordR] = useState('');

  const onPasswordChange = async () => {
    const changePasswordMutation = gql`
      mutation changePassword($userID: String!, $newPassword: String!, $oldPassword: String!) {
        changePassword(input: { userID: $userID, oldPassword: $oldPassword, newPassword: $newPassword }) {
          status
    }}`;

    const data = await mutateGraphQL(changePasswordMutation, { userID, newPassword, oldPassword });
    console.log(data)
    };

  const onEmailChange = async () => {
    const changeEmailMutation = gql`
      mutation changeEmail($userID: String!, $newEmail: String!, $password: String!) {
        changeEmail(input: { userID: $userID, newEmail: $newEmail, password: $password }) {
          status
    }}`;

    const data = await mutateGraphQL(changeEmailMutation, { userID, newEmail: email, password });
    console.log(data)
    };

  return (
    <View className='flex-1 bg-bgc'>
      <ChangeForm header='Change password' onSubmit={onPasswordChange} submitLabel='CHANGE PASSWORD'>
        <TextInput label='Old password'         placeholder='' value={oldPassword}  setValue={setOldPassword}   isPassword />
        <TextInput label='New password'         placeholder='' value={newPassword}  setValue={setNewPassword}   isPassword />
        <TextInput label='Repeat new password'  placeholder='' value={newPasswordR} setValue={setNewPasswordR}  isPassword />
      </ChangeForm>
      <ChangeForm header='Change email' onSubmit={onEmailChange} submitLabel='CHANGE EMAIL'>
        <TextInput label='Email' placeholder='excample@domain.com' value={email} setValue={setEmail} />
        <TextInput label='Password' placeholder='' value={password}  setValue={setPassword} isPassword />
      </ChangeForm>
    </View>
  );
}

const ChangeForm = ({header, onSubmit, submitLabel, children}:any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleHeaderPress = () => { setIsOpen(!isOpen) }

  return (
    <View>
      <TouchableOpacity className='flex flex-row align-center' onPress={handleHeaderPress}>
        {isOpen?<ArrowRight width={24} height={24} />:<ArrowDown width={24} height={24} />}
        <View className='flex justify-center'><Text className='text-white'>{header}</Text></View>
      </TouchableOpacity>
      { isOpen &&
        <View>
          {children}
          <Button label={submitLabel} onPress={onSubmit}/>
        </View>
      }
    </View>
  )
}
