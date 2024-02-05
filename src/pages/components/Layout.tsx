import { ReactNode } from 'react';
import { Layout } from 'antd';

const { Header, Content } = Layout;

interface LayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Layout>
      <Header style={{ color: '#fff' }}>Header</Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>{children}</div>
      </Content>
    </Layout>
  );
}

export default MainLayout;
