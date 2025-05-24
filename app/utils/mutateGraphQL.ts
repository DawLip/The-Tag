import { client } from '@/appollo-client';
import store from '@store/index';

const mutateGraphQL = async (mutation:any, variables:any) => {
  const token = store.getState().auth.token;
  try {
    const { data } = await client.mutate({
      mutation: mutation,
      variables: variables,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    console.log("Mutation result:", data);
    return data;
    } catch (error) { console.error("Mutation failed:", error); }
  };

  const queryGraphQL = async (query:any, variables:any, token:string) => {
  // const token = store.getState().auth.token;
  try {
    const { data } = await client.query({
      query: query,
      variables: variables,
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      fetchPolicy: 'no-cache'
    });

    console.log("Mutation result:", data);
    return data;
    } catch (error) { console.error("Mutation failed:", error); }
  };

export {mutateGraphQL, queryGraphQL};