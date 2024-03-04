import React from 'react';
import { Tabs } from 'antd';
import { ContainerOutlined, GiftOutlined, InteractionOutlined, SolutionOutlined, IdcardOutlined, SettingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { LayoutProps } from '@/models/layout';
import { UserBasicInfo } from '@/models/user';
import { PageHeader } from "@/components/page-header";
import { UserBasicInfoCard } from '@/components/user-basic-info-card';

const UserCenterTabs = [
    {
        label: '我的订单',
        key: '/user/order',
        icon: <ContainerOutlined />
    },
    {
        label: '我的捐赠',
        key: '/user/donation',
        icon: <GiftOutlined />
    },
    {
        label: '义工记录',
        key: '/user/volunteer',
        icon: <SolutionOutlined />
    },
    {
        label: '爱心币明细',
        key: '/user/coin-log',
        icon: <InteractionOutlined />
    },
    {
        label: '收货信息管理',
        key: '/user/consignee',
        icon: <IdcardOutlined />
    },
    {
        label: '偏好设置',
        key: '/user/settings',
        icon: <SettingOutlined />
    }
]

const TestData : UserBasicInfo = {
    name: "李华",
    email: "lihua@sjtu.edu.cn",
    type: "student",
    balance: 114514,
    continuous_login_days: 2
}

const UserLayout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();

    const handleTabChange = (key : string) => {
        router.push(key);
    };

    return (
        <>
            <PageHeader title="用户中心"/>
            <div className="container basic-card">
                <UserBasicInfoCard userInfo={TestData}/>
            </div>
            <div className="container basic-card">
                <Tabs 
                    tabPosition="left" 
                    size="large" 
                    activeKey={router.pathname}
                    onChange={handleTabChange}
                    items={UserCenterTabs.map(item => {
                            return {
                            label: item.label,
                            key: item.key,
                            icon: item.icon,
                            children: children,
                        };
                    })}
                >
                </Tabs>
            </div>
        </>
    );
};

export default UserLayout;
