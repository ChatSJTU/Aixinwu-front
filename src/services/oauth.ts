import { OidcRedirectDocument, OidcRedirectMutation, OidcTokenFetchDocument, OidcTokenFetchMutation, UserBasicInfoDocument } from "@/graphql/hooks";
import { Token } from "@/models/token";
import { ApolloClient } from "@apollo/client";

//请求 jAccount 登录
export async function externalLogin(client: ApolloClient<object>, redirectUri: string) {
    try {
        const resp = await client.mutate<OidcRedirectMutation>({
            mutation: OidcRedirectDocument,
            variables: {
              input: JSON.stringify({
                redirectUri: redirectUri
              }),
              pluginId: "aixinwu.authentication.openidconnect"
            }
        }); 
        if (!resp.data || 
            !resp.data.externalAuthenticationUrl) {
          throw "认证失败";
        }
        if (resp.data.externalAuthenticationUrl.errors.length != 0)
        {
          throw resp.data.externalAuthenticationUrl.errors[0].message;
        }
        var data = JSON.parse(resp.data?.externalAuthenticationUrl?.authenticationData) as AuthenticationData;
        if (!data.authorizationUrl)
        {
          throw "获取数据失败，请稍后重试";
        }
        return data.authorizationUrl;
    } catch (error) {
        var errmessage = `请求登录失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//处理回调，获取令牌
export async function fetchToken(client: ApolloClient<object>, code: string, state: string) {
    try {
        const resp = await client.mutate<OidcTokenFetchMutation>({
            mutation: OidcTokenFetchDocument,
            variables: {
              input: JSON.stringify({
                code: code,
                state: state,
              }), 
              pluginId: "aixinwu.authentication.openidconnect"
            }
        }); 
        if (!resp.data || 
            !resp.data.externalObtainAccessTokens) {
          throw "认证失败";
        }
        if (resp.data.externalObtainAccessTokens.errors.length != 0)
        {
          throw resp.data.externalObtainAccessTokens.errors[0].message;
        }
        return {
            token: resp.data.externalObtainAccessTokens.token,
            refreshToken: resp.data.externalObtainAccessTokens.refreshToken
        } as Token;
    } catch (error) {
        var errmessage = `获取令牌失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

