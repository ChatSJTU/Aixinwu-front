import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

const create_graphql_client = () => {
  const httpLink = new HttpLink({uri: process.env.NEXT_PUBLIC_GRAPHQL_URL})
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
  })
}

export default create_graphql_client
