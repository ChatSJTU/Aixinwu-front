import { ReactNode, useEffect, useState } from 'react';
import { Layout } from 'antd';
import { UserContext } from '@/contexts/UserContext';
import NavBar from '@/components/nav';

const { Header, Content, Footer } = Layout;

interface LayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    const [userTheme,setUserTheme] = useState<string>('light');

    useEffect(() => {
        const currentTheme = localStorage.getItem('currentTheme');
        if(currentTheme !== null) setUserTheme(currentTheme);
    },[])

    return (
        <UserContext.Provider value={{
            userTheme,
            setUserTheme,
            }}>
        <Layout className="main-layout">
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
        </UserContext.Provider>
    );
}

export default MainLayout;
