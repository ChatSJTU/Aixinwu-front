import { Avatar, Button, Col, Row, Space, Typography, Tag, Grid } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { AxCoin } from '@/components/axcoin';
import { UserBasicInfo } from '@/models/user';

const { Title } = Typography;

interface DayButtonProps {
    day: string;
    value: string | number;
    filled?: boolean
}
  
const DayButton: React.FC<DayButtonProps> = ({ day, value, filled = false }) => {
    return (
        <Button style={{ height: 'auto' }} type={ filled ? 'primary' : 'dashed' }>
            <div style={{ textAlign: 'center', lineHeight: '1.2' }}>
                <div>DAY</div>
                <div>{day}</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{value}</span>
                    <AxCoin size={13} style={{ marginLeft: '2px' }}/>
                </div>
            </div>
        </Button>
    );
};

const tagStyle : { [key: string]: { text: string; color: string }; } = {
    'faculty': { text: '教职工', color: 'blue' },
    'fs':      { text: '附属单位职工', color: 'magenta'},
    'postphd': { text: '博士后', color: 'cyan' },
    'student': { text: '学生', color: 'green' },
    'yxy':     { text: '医学院教职工', color: 'purple'},
};

export const UserBasicInfoCard: React.FC<{ userInfo: UserBasicInfo }> = ({ userInfo }) => {
    const { name, email, type, balance, continuous_login_days } = userInfo;
    const screens = Grid.useBreakpoint();
    
    const tag = tagStyle[type] || { text: '未知', color: 'default' };

    return (
        <Row justify="space-between" className="primary-text">
            <Col>
                <Space size="large" align="start">
                    <Avatar shape="square" size={80} icon={<UserOutlined />} />
                    <Space direction="vertical">
                        <Space>
                            <Title level={5} style={{margin: "0px"}}>{name}</Title>
                            <Tag color={tag.color}>{tag.text}</Tag>
                        </Space>
                        <span>{email}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>账户余额：</span>
                            <AxCoin size={14} 
                                value={balance}
                                valueStyle={{
                                    margin: '0px 0px 0px -4px',
                                    fontWeight: 'normal',
                                    fontSize: '14px',
                                }}/>
                        </div>
                    </Space>
                </Space>
            </Col>
            <Col>
                <Space 
                  direction={screens.md?"vertical":"horizontal"} 
                  style={!screens.md?{marginTop: '16px'}:{}}
                >
                    {screens.md && <span>已连续登录 {continuous_login_days} 天</span>}
                    <Space>
                        <DayButton day="1" value="0.5" filled={continuous_login_days===1}/>
                        <DayButton day="2" value="1" filled={continuous_login_days===2}/>
                        <DayButton day="3+" value="2" filled={continuous_login_days>=3}/>
                    </Space>
                    {!screens.md && <span>已连续登录 {continuous_login_days} 天</span>}
                </Space>
            </Col>
        </Row>
    );
};