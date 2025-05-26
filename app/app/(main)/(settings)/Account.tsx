import { Image, StyleSheet, Platform, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { client } from '@/appollo-client';


import Button from '@c/Button';
import Background from '@c/Background';
import ArrowRight from '@img/arrow-right.svg';
import ArrowDown from '@img/arrow-down.svg';
import TextInput from '@c/inputs/TextInput';

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
      <View style={styles.container}>
        <Background />
  
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ChangeForm header="Change password" onSubmit={onPasswordChange} submitLabel="CHANGE PASSWORD">
            <TextInput label="Old password" value={oldPassword} setValue={setOldPassword} isPassword />
            <TextInput label="New password" value={newPassword} setValue={setNewPassword} isPassword />
            <TextInput label="Repeat new password" value={newPasswordR} setValue={setNewPasswordR} isPassword />
          </ChangeForm>
  
          <ChangeForm header="Change email" onSubmit={onEmailChange} submitLabel="CHANGE EMAIL">
            <TextInput label="Email" placeholder="example@domain.com" value={email} setValue={setEmail} />
            <TextInput label="Password" value={password} setValue={setPassword} isPassword />
          </ChangeForm>
        </ScrollView>
      </View>
    );
  }
  
  const ChangeForm = ({ header, onSubmit, submitLabel, children }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prev => !prev);
  
    return (
      <View style={styles.section}>
        <TouchableOpacity style={styles.header} onPress={toggle}>
          {isOpen ? <ArrowRight width={24} height={24} /> : <ArrowDown width={24} height={24} />}
          <Text style={styles.headerText}>{header}</Text>
        </TouchableOpacity>
  
        {isOpen && (
          <View style={styles.form}>
            <View style={styles.fields}>{children}</View>
            <Button label={submitLabel} onPress={onSubmit} />
          </View>
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
      paddingTop: 16,
      paddingHorizontal: 48,
      paddingBottom: 48,
      gap: 32,
    },
    section: {
      marginBottom: 32,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerText: {
      color: 'white',
      fontSize: 20,
      fontFamily: 'Inter',
      fontWeight: '400',
      lineHeight: 30,
    },
    form: {
      marginTop: 24,
      gap: 24,
    },
    fields: {
      gap: 24,
    },
  });