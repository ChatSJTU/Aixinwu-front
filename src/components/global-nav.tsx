import { Space, Menu, Button } from 'antd';
import { SunOutlined, MoonOutlined, UserOutlined } from '@ant-design/icons';
import { UserContext } from '@/contexts/user';
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';
import { GraphQLContext } from '@/contexts/graphql';
import { ExternalObtainAccessTokens, useOidcRedirectMutation, useOidcTokenFetchMutation } from '@/graphql/hooks';
import AuthContext from '@/contexts/auth-context';

const NavBar = () => {
    const router = useRouter();
    const { userTheme, changeTheme } = useContext(UserContext);
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;

    const [oidcRedirectMutation] = useOidcRedirectMutation({client});

    const doExternalLogin = () => {
      oidcRedirectMutation({
        variables: {
          input: JSON.stringify({
            redirectUri: window.location.origin + router.basePath + "/oauth/redirectback"
          }),
          pluginId: "aixinwu.authentication.openidconnect"
        }
      }).then((value) => {
            let data = JSON.parse(value.data?.externalAuthenticationUrl?.authenticationData) as AuthenticationData
            window.location.replace(data.authorizationUrl)
      })
    };

    const menuItems = [
        { label: "置换", value: "/1" },
        { label: "租赁", value: "/2" },
        { label: "失物招领", value: "/3" },
        { label: "预捐赠", value: "/pre-donate" },
    ];

    return (
        <>
            <Space size="large" className="navbar">
                <Link href="/" className="title">SJTU 爱心屋</Link>
                <Menu className="menu"
                    selectedKeys={[router.pathname]}
                    mode="horizontal"
                    items={menuItems.map((item) => ({
                        key: item.value,
                        label: <Link href={item.value}>{item.label}</Link>,
                    }))}>
                </Menu>
            </Space>
            <Space size="middle" className="navbar">
                <Button type="text"
                    onClick={() => {changeTheme(userTheme === 'light' ? 'dark' : 'light')}}
                    icon = {userTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                />
                {
                  authCtx.isLoggedIn ?  
                  <Button type="text" icon={<UserOutlined />} onClick={()=>{router.push("/user")}}></Button>
                  :
                  <Button type="primary" onClick={doExternalLogin}>jAccount 登录</Button>
                }
                
            </Space>
        </>
    )
}

export default NavBar
