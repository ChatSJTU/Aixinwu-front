import { ReactNode, useEffect, useState } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
// import { useMediaQuery } from "react-responsive";
import { UserContext } from '@/contexts/UserContext';
import NavBar from '@/components/nav';

const { Header, Content, Footer } = Layout;

interface LayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    const [userTheme, setUserTheme] = useState<string>('light');
    // const preferDark = useMediaQuery({query: "(prefers-color-scheme: dark)"});

    useEffect(() => {
        var currentTheme = localStorage.getItem('currentTheme');
        if (currentTheme === null) {
            currentTheme = 'light';
            localStorage.setItem('themeContextValue', currentTheme);
        }
        setUserTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
    },[])

    const changeTheme = (themeName : string) => {        
        setUserTheme(themeName);
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem('themeContextValue', themeName);
    }

    return (
        <UserContext.Provider value={{
            userTheme,
            changeTheme,
            }}>
            <ConfigProvider
                theme={{ 
                    algorithm: userTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }}
            >
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
            </ConfigProvider>
        </UserContext.Provider>
    );
}

export default MainLayout;