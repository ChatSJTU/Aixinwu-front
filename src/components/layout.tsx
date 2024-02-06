import { ReactNode, useEffect, useState } from 'react';
import { Layout, ConfigProvider, theme, FloatButton, QRCode } from 'antd';
import { CommentOutlined } from '@ant-design/icons'
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
        var currentTheme = localStorage.getItem('themeContextValue');
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
                    token: { colorPrimary: "#1677ff", colorInfo: "#1677ff" },
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
                        Copyright ©{new Date().getFullYear()} 上海交通大学爱心屋 版权所有
                    </Footer>
                </Layout>
                <FloatButton shape="square"
                    style={{ right: 24 }}
                    icon={<CommentOutlined />}
                />
            </ConfigProvider>
        </UserContext.Provider>
    );
}

export default MainLayout;
