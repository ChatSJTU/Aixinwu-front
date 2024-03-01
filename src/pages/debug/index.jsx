import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Layout, Menu, Pagination, Space, theme } from 'antd';
const { Header, Content, Sider } = Layout;
const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});
const DebugPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Space direction='vertical' style={{width: "100%"}}>
      <Card>
          <Layout>
          <Header
                style={{
                display: 'flex',
                alignItems: 'center',
                }}
            >
                <div/>
                <Menu
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={items1}
                style={{
                    flex: 1,
                    minWidth: 0,
                }}
                />
          </Header>
              <Layout>
                    <Sider
                    width={200}
                    style={{
                        background: colorBgContainer,
                    }}
                    >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{
                        height: '100%',
                        borderRight: 0,
                        }}
                        items={items2}
                    />
                    </Sider>
                    <Layout
                    style={{
                        padding: '0 24px 24px',
                    }}
                    >
                    <Breadcrumb
                        style={{
                        margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        }}
                    >
                        Content
                    </Content>
                    </Layout>
              </Layout>
          </Layout>
      </Card>           

      <Card>
        <Pagination
            total={85}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            />
      </Card>
    </Space>
  );
};
export default DebugPage;