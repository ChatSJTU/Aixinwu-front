import { Space, Menu, Button, MenuProps, Dropdown, Modal, Input, Typography, Badge, Grid } from 'antd';
import { SunOutlined, MoonOutlined, UserOutlined, SearchOutlined, LogoutOutlined, ShoppingCartOutlined, LoginOutlined } from '@ant-design/icons';
import ThemeContext from '@/contexts/theme';
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { AxCoin } from './axcoin';
import { fetchUserBasicInfo } from '@/services/user';
import { oidcRedirectJaccount } from '@/services/oauth';
import CartContext from '@/contexts/cart';

const { Title, Text } = Typography;
const { Search } = Input;

const NavBar = () => {
  const router = useRouter();
  const themeCtx = useContext(ThemeContext);
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const client = authCtx.client;
  const message = useContext(MessageContext);
  const [ searchModalOpen, setSearchModalOpen ] = useState(false);
  const [ searchText, setSearchText ] = useState<string>('');
  const screens = Grid.useBreakpoint();

  const items : MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a href="/user" rel="noopener noreferrer">
          <span>已登录：</span>
          <span>{authCtx.userInfo?.name}</span>
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a href="/user/coin-log" rel="noopener noreferrer">
          <span>账户余额：</span>
          <AxCoin size={14} 
            value={authCtx.userInfo?.balance}
            valueStyle={{
                margin: '0px 0px 0px -4px',
                fontWeight: 'normal',
                fontSize: '14px',
            }}/>
        </a>
      ),
    },
    {
        type: 'divider'
    },
    {
      key: '4',
      danger: true,
      label: (
        <a onClick={()=>{authCtx.onLogout()}}>
          <span>退出登录</span>
        </a>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  useEffect(()=>{
    if (authCtx.isLoggedIn)
    {
      fetchUserBasicInfo(client!)
        .then(data => authCtx.updateUserInfo(data))
        .catch(err => message.error(err));
    }
  }, [authCtx.isLoggedIn]);

  const doExternalLogin = () => {
    oidcRedirectJaccount(client!, window.location.origin + router.basePath + "/oauth/redirectback")
      .then((data) => {
        window.location.replace(data)
      },(err)=>{
        message.error(err);
      });
  };

  const menuItems = [
      { label: "置换", value: "/products/"+process.env.NEXT_PUBLIC_CHANNEL },
      { label: "租赁", value: "/products/"+process.env.NEXT_PUBLIC_CHANNEL2},
    //   { label: "失物招领", value: "/3" },
      // { label: "预捐赠", value: "/pre-donate" },
  ];

  const handleSearch = (value: string, domain: string = "products") => {
    // 处理搜索逻辑
    setSearchModalOpen(false);
    setSearchText('');
    router.push({
        pathname: '/search',
        query: { keyword: value, domain: domain, sort: 'default', page: 1},
    });
  };

  return (
      <>
          <Space size="large" className="navbar">
              <Link href="/" className="title">SJTU 爱心屋</Link>
              {
                !(!screens.md && router.asPath=="/") &&
                <div style={{display: 'flex'}}>
                  <Menu className="menu" style={{ minWidth: 0, flex: "auto" }}
                      selectedKeys={[router.asPath]}
                      mode="horizontal"
                      items={menuItems.map((item) => ({
                          key: item.value,
                          label: <Link href={item.value}>{item.label}</Link>,
                      }))}>
                  </Menu>
                </div>
              }
          </Space>
          <Space size={screens.md ? "middle" : "small"} className="navbar">
              <Button type="text" onClick={()=>{setSearchModalOpen(true);}} icon={<SearchOutlined />} />
              <Modal open={searchModalOpen} style={{ top: 4 }} className="search-modal"
                closeIcon={null}
                footer={null}
                width={800}
                onCancel={()=>{setSearchModalOpen(false);setSearchText('');}}
              >
                <div className="modal-content-wrapper">
                  <Search
                    style={{marginTop: '12px'}}
                    enterButton
                    placeholder="请输入关键词"
                    onSearch={(value)=>handleSearch(value)}
                    value={searchText}
                    onChange={(e)=>{setSearchText(e.target.value);console.log(e.target.value);}}
                  />
                  {searchText.trim() !== '' && 
                    <Menu mode='vertical'
                      style={{ minWidth: 0, flex: "auto", border: 'none', marginTop: '8px' }}
                    >
                      <Menu.Item style={{ marginInline: "unset", marginBlock: "unset", width: "100%" }} key={`关于${searchText}的物品`} onClick={() => handleSearch(searchText, 'products')}>
                        <Space>
                          <SearchOutlined/>
                          <Text>{`搜索关于 ${searchText} 的闲置物品`}</Text>
                          <Text keyboard>Enter</Text>
                        </Space>
                      </Menu.Item>
                      <Menu.Item style={{ marginInline: "unset", marginBlock: "unset", width: "100%" }} key={`关于${searchText}的租赁`} onClick={() => handleSearch(searchText, 'rent')}>
                        <Space>
                          <SearchOutlined/>
                          <Text>{`搜索关于 ${searchText} 的租赁服务`}</Text>
                        </Space>
                      </Menu.Item>
                      <Menu.Item style={{ marginInline: "unset", marginBlock: "unset", width: "100%" }} key={`关于${searchText}的文章`} onClick={() => handleSearch(searchText, 'articles')}>
                        <Space>
                          <SearchOutlined/>
                          <Text>{`搜索关于 ${searchText} 的文章`}</Text>
                        </Space>
                      </Menu.Item>
                    </Menu>}
                </div>
              </Modal>
              {
                screens.md &&
                <Button type="text"
                  onClick={() => {themeCtx.changeTheme(themeCtx.userTheme === 'light' ? 'dark' : 'light')}}
                  icon = {themeCtx.userTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                />
              }
              {
                authCtx.isLoggedIn && 
                <Badge count={cartCtx.totalQuantity} size="small">
                  <Button type="text"
                      onClick={()=>{router.push("/cart")}}
                      icon = {<ShoppingCartOutlined />}
                  />
                </Badge>
              }
              
              {
                authCtx.isLoggedIn &&
                <Dropdown menu={{ items }} placement="bottom">
                  <Button type="text" icon={<UserOutlined />} onClick={()=>{router.push("/user")}}></Button>
                </Dropdown>
                // <Button type="text" icon={<UserOutlined />} onClick={()=>{router.push("/user")}}></Button>
              }
              {
                !authCtx.isLoggedIn && screens.md &&
                <Button type="primary" onClick={doExternalLogin}>jAccount 登录</Button>
              }
              {
                !authCtx.isLoggedIn && !screens.md &&
                <Button type="primary" onClick={doExternalLogin} icon={<LoginOutlined />}>登录</Button>
              }
              
          </Space>
      </>
  )
}

export default NavBar
