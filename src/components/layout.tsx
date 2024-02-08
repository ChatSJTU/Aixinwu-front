import { ReactNode, useEffect, useState } from 'react';
import { Layout, ConfigProvider, theme, FloatButton } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons'
import { UserContext } from '@/contexts/UserContext';
import NavBar from '@/components/global-nav';
import GlobalFooter from '@/components/global-footer';

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
            </ConfigProvider>
        </UserContext.Provider>
    );
}

export default MainLayout;
