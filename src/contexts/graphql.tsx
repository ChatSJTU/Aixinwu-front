import { ApolloClient } from '@apollo/client';
import { createContext } from 'react';
import create_graphql_client from '@/graphql';

interface GraphQLContextType {
  client: ApolloClient<object>
}

export const GraphQLContext = createContext<GraphQLContextType>({
  client: create_graphql_client() 
});
