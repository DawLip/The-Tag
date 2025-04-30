import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import config from '@/config';

const client = new ApolloClient({
  uri: config.urls.graphql, 
  cache: new InMemoryCache(),
});

export { client };