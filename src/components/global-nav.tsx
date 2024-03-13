import { Space, Menu, Button, MenuProps, Dropdown, Modal, Input, Typography } from 'antd';
import { SunOutlined, MoonOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import ThemeContext from '@/contexts/theme';
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useState } from 'react';
import { useOidcRedirectMutation } from '@/graphql/hooks';
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { AxCoin } from './axcoin';

const { Title, Text } = Typography;
const { Search } = Input;

const NavBar = () => {
  const router = useRouter();
  const themeCtx = useContext(ThemeContext);
  const authCtx = useContext(AuthContext);
  const client = authCtx.client;
  const [oidcRedirectMutation] = useOidcRedirectMutation({client});
  const message = useContext(MessageContext);
  const [ searchModalOpen, setSearchModalOpen ] = useState(false);
  const [ searchText, setSearchText ] = useState<string>('');

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

  const handleSearchMenuClick = (e: any) => {
    handleSearch(e.key);
  };

  return (
      <>
          <Space size="large" className="navbar">
              <Link href="/" className="title">SJTU 爱心屋</Link>
              <div style={{display: 'flex'}}>
              <Menu className="menu" style={{ minWidth: 0, flex: "auto" }}
                  selectedKeys={[router.pathname]}
                  mode="horizontal"
                  items={menuItems.map((item) => ({
                      key: item.value,
                      label: <Link href={item.value}>{item.label}</Link>,
                  }))}>
              </Menu></div>
          </Space>
          <Space size="middle" className="navbar">
              <Button type="text" onClick={()=>{setSearchModalOpen(true);}} icon={<SearchOutlined />} />
              <Modal open={searchModalOpen} style={{ top: 0 }} className="search-modal"
                closeIcon={null}
                footer={null}
                width={800}
                onCancel={()=>{setSearchModalOpen(false);setSearchText('');}}
              >
                <div className="modal-content-wrapper">
                  <Search
                    style={{marginTop: '16px'}}
                    enterButton
                    placeholder="请输入关键词"
                    onSearch={handleSearch}
                    value={searchText}
                    onChange={(e)=>{setSearchText(e.target.value);console.log(e.target.value);}}
                  />
                  {searchText.trim() !== '' && 
                    <Menu mode='vertical' onClick={handleSearchMenuClick} 
                      style={{ minWidth: 0, flex: "auto", border: 'none', marginTop: '8px' }}
                    >
                      <Menu.Item key={`关于${searchText}的物品`}>
                        <Space>
                          <SearchOutlined/>
                          <Text>{`搜索关于 ${searchText} 的物品`}</Text>
                          <Text type='secondary' style={{fontSize: '12px'}}>{'或按Enter'}</Text>
                        </Space>
                      </Menu.Item>
                      <Menu.Item key={`关于${searchText}的文章`}>
                        <Space>
                          <SearchOutlined/>
                          <Text>{`搜索关于 ${searchText} 的文章`}</Text>
                        </Space>
                      </Menu.Item>
                    </Menu>}
                </div>
              </Modal>
              <Button type="text"
                  onClick={() => {themeCtx.changeTheme(themeCtx.userTheme === 'light' ? 'dark' : 'light')}}
                  icon = {themeCtx.userTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
              />
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
