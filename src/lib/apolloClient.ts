import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
// process.env.NEXT_PUBLIC_API_URL
const httpLink = createHttpLink({
  uri: '/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
