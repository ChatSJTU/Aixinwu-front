import { Space, Menu, Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { UserContext } from '@/contexts/user';
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';
import { GraphQLContext } from '@/contexts/graphql';
import { useOidcRedirectMutation, useOidcTokenFetchMutation } from '@/graphql/hooks';

const NavBar = () => {
    const router = useRouter();
    const { userTheme, changeTheme } = useContext(UserContext);

    const menuItems = [
        { label: "置换", value: "/1" },
        { label: "租赁", value: "/2" },
        { label: "失物招领", value: "/3" },
        { label: "预捐赠", value: "/pre-donate" },
    ];

    const {client} = useContext(GraphQLContext)

    const [oidcRedirectMutation] = useOidcRedirectMutation({client})

    const [oidcFetchTokenMutation] = useOidcTokenFetchMutation({client})

    useEffect(()=>{
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get("code")
      const state = urlParams.get("state")
      if(code && state){
        oidcFetchTokenMutation({
          variables: {
            input: JSON.stringify({
            code: code,
            state: state,
          }), pluginId: "aixinwu.authentication.openidconnect"
          }
        }).then((value) => {
          console.log(value.data?.externalObtainAccessTokens)
        }).then(() => {
          window.location.replace(window.location.href.split('?')[0])
        })
      }
    },[])

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
                <Button type="primary"  onClick = {() => {

              oidcRedirectMutation({
            variables: {
              input: JSON.stringify({
                redirectUri: window.location.href
              }),
              pluginId: "aixinwu.authentication.openidconnect"
            }
          }).then((value) => {
                let data = JSON.parse(value.data?.externalAuthenticationUrl?.authenticationData) as AuthenticationData
                window.location.replace(data.authorizationUrl)
          })
 
        }}>jAccount 登录</Button>
            </Space>
        </>
    )
}

export default NavBar
