import { useEffect, useState } from 'react';
import { Layout, FloatButton } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons'
import NavBar from '@/components/global-nav';
import GlobalFooter from '@/components/global-footer';
import { LayoutProps } from '@/models/layout';

const { Header, Content, Footer } = Layout;

const MainLayout: React.FC<LayoutProps> = ({ children }) => {

    return (
        <>
            <Layout className="main-layout">
                <Header className="layout-header" style={{position: 'sticky'}}>
                    <NavBar/>
                </Header>
                <Content className="layout-content">
                    {children}
                </Content>
                <Footer className="layout-footer">
                    <GlobalFooter/>
                </Footer>
            </Layout>
            <FloatButton shape="square"
                style={{ right: 24 }}
                icon={<ArrowUpOutlined />}
                onClick={()=>{window.scrollTo({ top: 0, behavior: 'smooth' });}}
            />
        </>
    );
}

export default MainLayout;
