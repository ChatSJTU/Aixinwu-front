import { Space, Menu, Button } from 'antd';
import { SunOutlined, MoonOutlined, UserOutlined } from '@ant-design/icons';
import ThemeContext from '@/contexts/theme';
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext } from 'react';
import { useOidcRedirectMutation } from '@/graphql/hooks';
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';

const NavBar = () => {
    const router = useRouter();
    const themeCtx = useContext(ThemeContext);
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;

    const [oidcRedirectMutation] = useOidcRedirectMutation({client});
    const message = useContext(MessageContext);

    const doExternalLogin = () => {
      oidcRedirectMutation({
        variables: {
          input: JSON.stringify({
            redirectUri: window.location.origin + router.basePath + "/oauth/redirectback"
          }),
          pluginId: "aixinwu.authentication.openidconnect"
        }
      }).then((value) => {
        if (!value.data || 
            !value.data.externalAuthenticationUrl) {
          throw "认证失败";
        }
        if (value.data.externalAuthenticationUrl.errors.length != 0)
        {
          throw value.data.externalAuthenticationUrl.errors[0].message;
        }
        var data = JSON.parse(value.data?.externalAuthenticationUrl?.authenticationData) as AuthenticationData;
        if (!data.authorizationUrl)
        {
          throw "获取数据失败，请稍后重试";
        }
        return data;
      }).then((data) => {
        window.location.replace(data.authorizationUrl)
      },(err)=>{
        message.error(err);
      });
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
                    onClick={() => {themeCtx.changeTheme(themeCtx.userTheme === 'light' ? 'dark' : 'light')}}
                    icon = {themeCtx.userTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
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
