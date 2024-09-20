import { ExternalObtainAccessTokens, User } from "@/graphql/hooks"
import React, { useCallback, useEffect, useMemo, useState, useContext } from "react"
import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client"
import { onError } from "@apollo/client/link/error";
import useLocalStorage from "@/hooks/useLocalStorage"
import { LayoutProps } from "@/models/layout"
import { useRouter } from 'next/router'
import { Token } from "@/models/token"
import { UserBasicInfo } from "@/models/user"
import { oidcRefreshToken } from "@/services/oauth";
import { MessageContext } from '@/contexts/message';
import { oidcRedirectJaccount } from '@/services/oauth';

interface AuthContextType {
  token: string,
  refreshToken: string,
  isLoggedIn: boolean,
  onLogin: (data: Token) => void,
  updateUserInfo: (user: UserBasicInfo) => void,
  onLogout: () => void,
  onLoggedInOr403: () => boolean,
  client: ApolloClient<object> | undefined,
  userInfo: UserBasicInfo | undefined
  doExternalLogin: () => void
}

const AuthContext = React.createContext<AuthContextType>({
  token: "",
  refreshToken: "",
  isLoggedIn: false,
  onLogin: (data: Token) => {},
  updateUserInfo: (user: UserBasicInfo) => {},
  onLogout: () => {},
  onLoggedInOr403: () => false,
  client: undefined,
  userInfo: undefined,
  doExternalLogin: () => {}
})

const calculateRemainDuration = (expTime : number) => {
  const currentTime = new Date().getTime()
  const formatedExp = new Date(expTime).getTime()
  const remainDuration = formatedExp - currentTime
  return remainDuration
}

const createGraphqlClient = (token: string | null, useToken: boolean, refreshToken: string, setToken: React.Dispatch<React.SetStateAction<string>>, setExp: React.Dispatch<React.SetStateAction<number>>) => {
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

    //fallback 策略，一般情况下不会触发
    const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          switch ((err.extensions?.exception as any).code) {
            // Apollo Server sets code to UNAUTHENTICATED
            // when an AuthenticationError is thrown in a resolver
            case "ExpiredSignatureError":
              //console.log(`refreshToken is ${refreshToken}`)
              if (refreshToken == "")
                return;

              // let fulfilled = false;
              // let success = false;
              // let token = "";
              oidcRefreshToken(new ApolloClient({
                link: new HttpLink({
                  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
                }),
                cache: new InMemoryCache()
              }), refreshToken).then((data) => {
                if (data)
                {
                  //success = true;
                  setToken(data);
                  setExp((new Date().getTime() + 20 * 60 * 1000));
                  //token = data;
                }
                //fulfilled = true;
              }).catch((err) => {
                //fulfilled = true;
              });
              // while(!fulfilled){}
              // if (!success)
              //   return;
              // // Modify the operation context with a new token
              // const oldHeaders = operation.getContext().headers;
              // operation.setContext({
              //   headers: {
              //     ...oldHeaders,
              //     authorization: token,
              //   },
              // });
              // // Retry the request, returning the new observable
              // return forward(operation);
          }
        }
      }
    
      // To retry on network errors, we recommend the RetryLink
      // instead of the onError link. This just logs the error.
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    });

  return new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache()
  })
}

export const AuthContextProvider = (props : LayoutProps) => {
  const [refreshToken, setRefreshToken] = useLocalStorage<string>("refreshToken", "");
  const [token, setToken] = useLocalStorage<string>("token", "");
  const [exp, setExp] = useLocalStorage<number>("expTime", 0);
  const [userInfo, setUserInfo] = useState<UserBasicInfo>({} as UserBasicInfo);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(undefined);
  const router = useRouter();
  const message = useContext(MessageContext);
  
  const isLoggedIn = (!!token) && (calculateRemainDuration(exp) > 0)

  const client = useMemo(() => {
    return createGraphqlClient(token, isLoggedIn, refreshToken, setToken, setExp);
  }, [token, isLoggedIn]);

  const doRefresh = () => {
    oidcRefreshToken(new ApolloClient({
      link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      }),
      cache: new InMemoryCache()
    }), refreshToken).then((data)=>{
      if (!data)
        return;
      setToken(data);
      setExp((new Date().getTime() + 20 * 60 * 1000));
    });
  };

  useEffect(() => {
    if (timerId == undefined)
    {
      var id = setInterval(() => {
        if (refreshToken == "")
          return;
        doRefresh();
      }, 20 * 60 * 1000); //20 * 60
      setTimerId(id);
    }
  });

  useEffect(() => {
    if (!isLoggedIn && !!refreshToken) {
      doRefresh();
    }
  });

  const loginHandler = (data: Token) => {
    setRefreshToken(data.refreshToken!)
    setToken(data.token!)
    setExp((new Date().getTime() + 20 * 60 * 1000))
  }

  const logoutHandler = useCallback(() => {
    setRefreshToken("")
    setToken("")
    setExp(1)
    setUserInfo({} as UserBasicInfo)
    if (navigator.userAgent.includes("TaskCenterApp")) {
      location.reload();
    }
    else {
      router.push(`http://jaccount.sjtu.edu.cn/oauth2/logout?client_id=${process.env.NEXT_PUBLIC_JACCOUNT_CLIENT_ID}&post_logout_redirect_uri=${window.location.origin + router.basePath}`);
    }
  }, [])

  const loggedInOr403 = () => {
    if (!isLoggedIn)
      {
        router.push('/403');
        return false;
      }
    return true;
  }

  const updateUserInfo = (user: UserBasicInfo) => {
    setUserInfo(user);
  };

  const doExternalLogin = () => {
    oidcRedirectJaccount(client!, window.location.origin + router.basePath + "/oauth/redirectback")
      .then((data) => {
        window.location.replace(data)
      },(err)=>{
        message.error(err);
      });
  };

  const contextValue = {
    token: token || "",
    refreshToken: refreshToken || "",
    isLoggedIn: isLoggedIn,
    onLogin: loginHandler,
    updateUserInfo: updateUserInfo,
    onLogout: logoutHandler,
    onLoggedInOr403: loggedInOr403,
    client: client,
    userInfo: userInfo,
    doExternalLogin: doExternalLogin
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext