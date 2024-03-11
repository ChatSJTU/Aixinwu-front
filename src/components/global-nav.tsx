import { Space, Menu, Button, MenuProps, Dropdown, Modal, Input } from 'antd';
import { SunOutlined, MoonOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import ThemeContext from '@/contexts/theme';
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useState } from 'react';
import { useOidcRedirectMutation } from '@/graphql/hooks';
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { AxCoin } from './axcoin';

const { Search } = Input;

const NavBar = () => {
  const router = useRouter();
  const themeCtx = useContext(ThemeContext);
  const authCtx = useContext(AuthContext);
  const client = authCtx.client;
  const [oidcRedirectMutation] = useOidcRedirectMutation({client});
  const message = useContext(MessageContext);
  const [ searchModalOpen, setSearchModalOpen ] = useState(false);

  const items : MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer">
          <span>已登录：</span>
          <span>{authCtx.userInfo?.account}</span>
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer">
          <span>账户余额：{authCtx.userInfo?.balance}</span>
        </a>
      ),
      icon: <AxCoin size={12} style={{ marginRight: '4px' }}/>,
      // disabled: true,
    },
    {
      key: '4',
      danger: true,
      label: (
        <a onClick={()=>{authCtx.onLogout()}}>
          <span>退出登录</span>
        </a>
      ),
    },
  ]

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

  const handleSearch = (value: string) => {
    // 处理搜索逻辑
    console.log(value);
    setSearchModalOpen(false);
  };

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
              <Button type="text" onClick={()=>{setSearchModalOpen(true);}} icon={<SearchOutlined />} />
              <Modal open={searchModalOpen}
                title="搜索物品"
                footer={<br/>}
                width={800}
                maskClosable={true}
                onCancel={()=>{setSearchModalOpen(false);}}
              >
                <br />
                <Search allowClear placeholder="请输入物品名称" onSearch={handleSearch} enterButton />
              </Modal>
              {
                authCtx.isLoggedIn ? 
                <Dropdown menu={{ items }} placement="bottom">
                  <Button type="text" icon={<UserOutlined />} onClick={()=>{router.push("/user")}}></Button>
                </Dropdown>
                // <Button type="text" icon={<UserOutlined />} onClick={()=>{router.push("/user")}}></Button>
                :
                <Button type="primary" onClick={doExternalLogin}>jAccount 登录</Button>
              }
              
          </Space>
      </>
  )
}

export default NavBar
