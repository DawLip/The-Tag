import { login, setLoading, setError } from '@store/slices/authSlice';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { client } from '@/appollo-client';

export const registerThunk = (
  { email, nickname, password, rPassword }:{ 
    email:string, 
    nickname: string, 
    password: string, 
    rPassword: string
  }) => async (dispatch:any) => {
  console.log('=== User attempts to Register ===')

  dispatch(setLoading(true)); 
  dispatch(setError(null)); 

  try {
    const { data } = await client.mutate({
      mutation: REGISTER,
      variables: { email, nickname, password },
    });
    console.log(data.register.access_token)

    if (data.register.status=="SUCCESS") {
      console.log("Register successful");
      dispatch(login({token: data.register.access_token, userId: data.register.user._id}));
    } else {
      console.error("Register failed:", data.register.status);
      dispatch(setError(data.register.status));
    }
  } catch (err:any) {
    console.error("Error during register:", err);
    dispatch(setError(err.message));
  } finally { dispatch(setLoading(false)) }; 
};

const REGISTER = gql`
  mutation register($email: String!, $nickname: String!, $password: String!) {
    register(
      input: { username: $nickname, email: $email, password: $password }
    ) {
      status,
      access_token,
      user{
        _id
      }
    }
  }
`;