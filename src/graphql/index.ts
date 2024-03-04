import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"

const create_graphql_client = () => {
  const httpLink = new HttpLink({uri: "http://localhost:8000/graphql/"})
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
  })
}

export default create_graphql_client
