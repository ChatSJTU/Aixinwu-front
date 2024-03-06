import { AxwLogo } from "@/components/axw-logo";
import { LoadingSpin } from "@/components/loading-spin";
import AuthContext from "@/contexts/auth";
import { UserContext } from "@/contexts/theme";
import { useOidcTokenFetchMutation, ExternalObtainAccessTokens } from "@/graphql/hooks";
import { Button, Card, Flex, Result, Space } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { SmileOutlined } from '@ant-design/icons';
import Head from "next/head";

const OauthRedirctBack = () => {
    const router = useRouter();
    const { userTheme, changeTheme } = useContext(UserContext);
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;

    const [oidcFetchTokenMutation] = useOidcTokenFetchMutation({client});

    const doFetchToken = (code: string, state: string) => {
      oidcFetchTokenMutation({
        variables: {
          input: JSON.stringify({
            code: code,
            state: state,
          }), 
          pluginId: "aixinwu.authentication.openidconnect"
        }
      }).then((value) => {
        authCtx.onLogin(value.data?.externalObtainAccessTokens! as ExternalObtainAccessTokens)
      }).then(() => {
        router.push('/', undefined, { shallow: true })
      })
    };

    useEffect(()=>{
      if(router.query.code && router.query.state){
        doFetchToken(router.query.code as string, router.query.state as string)
      }
    },[router.query])

    return (
        <>
            <Head>
                <title>jAccount 认证中 - 上海交通大学绿色爱心屋</title>
            </Head>
            <Flex 
                style={{height: "500px"}}
                justify="center" 
                align="center">
                <Card>
                <Result
                    icon={<SmileOutlined />}
                    title="正在验证登录，请稍后……"/>
                </Card>
            </Flex>
        </>
    );
}

export default OauthRedirctBack