import { ReactNode } from 'react';
import { Layout } from 'antd';
import NavBar from './nav';

const { Header, Content, Footer } = Layout;

interface LayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Layout>
        <Header className="layout-header" 
            style={{ 
                position: 'sticky', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
            }}
        >
            <NavBar/>
        </Header>
        <Content className="layout-content" style={{ padding: '50px 50px 0px 50px' }}>
            {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
            Copyright ©{new Date().getFullYear()} 爱心屋联盟 版权所有
        </Footer>
    </Layout>
  );
}

export default MainLayout;
