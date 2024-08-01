import { useContext } from 'react';
import { Layout, FloatButton, Grid } from 'antd';
import { ArrowUpOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons'
import NavBar from '@/components/global-nav';
import GlobalFooter from '@/components/global-footer';
import { LayoutProps } from '@/models/layout';
import ThemeContext from '@/contexts/theme';

const { Header, Content, Footer } = Layout;

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const themeCtx = useContext(ThemeContext);
  const screens = Grid.useBreakpoint();

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
            <FloatButton.Group 
                shape="square"
                style={screens.md ? { bottom: 60, right: 30 } : { bottom: 48, right: 20 }}
            >
              <FloatButton
                  icon={<ArrowUpOutlined />}
                  onClick={()=>{window.scrollTo({ top: 0, behavior: 'smooth' });}}
              />
              {
                !screens.md &&
                <FloatButton
                  onClick={() => {themeCtx.changeTheme(themeCtx.userTheme === 'light' ? 'dark' : 'light')}}
                  icon = {themeCtx.userTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                />
              }
            </FloatButton.Group>
        </>
    );
}

export default MainLayout;
