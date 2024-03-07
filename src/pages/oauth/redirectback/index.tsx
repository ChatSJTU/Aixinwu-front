import AuthContext from "@/contexts/auth";
import { useOidcTokenFetchMutation, ExternalObtainAccessTokens } from "@/graphql/hooks";
import { Button, Card, Flex, Result } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import Head from "next/head";
import { MessageContext } from "@/contexts/message";

const OauthRedirctBack = () => {
    const router = useRouter();
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;
    const [oidcFetchTokenMutation] = useOidcTokenFetchMutation({client});
    const [isError, setIsError] = useState<boolean>(false);
    const [errMessage, setErrMessage] = useState<string>("");
    const message = useContext(MessageContext);

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
        if (!value.data || 
            !value.data.externalObtainAccessTokens) {
          throw "认证失败";
        }
        if (value.data.externalObtainAccessTokens.errors.length != 0)
        {
          throw value.data.externalObtainAccessTokens.errors[0].message;
        }
        return value;
      }).then((value) => {
        authCtx.onLogin(value.data?.externalObtainAccessTokens! as ExternalObtainAccessTokens)
        router.push('/', undefined, { shallow: true })
      },(err)=>{
        message.error(err);
        setErrMessage(err);
        setIsError(true);
      });
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
                { isError ? 
                  <Card style={{maxWidth: "800px"}}>
                    <Flex 
                      justify="center">
                      <Result
                        icon={<FrownOutlined />}
                        title={"认证失败"}
                        subTitle={errMessage}
                        extra={
                          <Button type="primary" onClick={()=>{router.push('/')}}>回到首页</Button>
                        }/>
                    </Flex>
                  </Card>
                  :
                  <Card style={{maxWidth: "800px"}}>
                    <Result
                      icon={<SmileOutlined />}
                      title="正在验证登录，请稍后……"/>
                  </Card>
                }
                
            </Flex>
        </>
    );
}

export default OauthRedirctBack