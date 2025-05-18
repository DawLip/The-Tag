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

export {mutateGraphQL};