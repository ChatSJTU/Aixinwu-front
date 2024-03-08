import { ExternalObtainAccessTokens, User } from "@/graphql/hooks"
import React, { useCallback, useMemo, useState } from "react"
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import useLocalStorage from "@/hooks/useLocalStorage"
import { LayoutProps } from "@/models/layout"

interface AuthContextType {
  token: string,
  refreshToken: string,
  isLoggedIn: boolean,
  onLogin: (data: ExternalObtainAccessTokens) => void,
  onLogout: () => void,
  client: ApolloClient<object> | undefined,
  userInfo: User | undefined
}

const AuthContext = React.createContext<AuthContextType>({
  token: "",
  refreshToken: "",
  isLoggedIn: false,
  onLogin: (data: ExternalObtainAccessTokens) => {},
  onLogout: () => {},
  client: undefined,
  userInfo: undefined
})

const calculateRemainDuration = (expTime : number) => {
  const currentTime = new Date().getTime()
  const formatedExp = new Date(expTime).getTime()
  const remainDuration = formatedExp - currentTime
  return remainDuration
}

const createGraphqlClient = (token: string | null, useToken: boolean) => {
  const httpLink = useToken ? 
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }) : 
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
  })
}

export const AuthContextProvider = (props : LayoutProps) => {
  const [refreshToken, setRefreshToken] = useLocalStorage<string>("refreshToken", "");
  const [token, setToken] = useLocalStorage<string>("token", "");
  const [exp, setExp] = useLocalStorage<number>("expTime", 0);
  const [userInfo, setUserInfo] = useState<User>({} as User);
  
  const isLoggedIn = (!!token) && (calculateRemainDuration(exp) > 0)

  const client = useMemo(() => {
    return createGraphqlClient(token, isLoggedIn);
  }, [token, isLoggedIn]);

  const loginHandler = (data: ExternalObtainAccessTokens) => {
    setRefreshToken(data.refreshToken!)
    setToken(data.token!)
    setExp((new Date().getTime() + 1800*1000))
    setUserInfo(data.user!)
  }

  const logoutHandler = useCallback(() => {
    setRefreshToken("")
    setToken("")
    setExp(1)
    setUserInfo({} as User)
    location.reload();
  }, [])

  const contextValue = {
    token: token || "",
    refreshToken: refreshToken || "",
    isLoggedIn: isLoggedIn,
    onLogin: loginHandler,
    onLogout: logoutHandler,
    client: client,
    userInfo: userInfo
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext