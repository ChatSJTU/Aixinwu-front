import { Space, Menu, Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { UserContext } from '@/contexts/UserContext';
import { useRouter } from "next/router";
import Link from "next/link";
import { useContext } from 'react';

const NavBar = () => {
    const router = useRouter();
    const { userTheme, changeTheme } = useContext(UserContext);

    const menuItems = [
        { label: "置换", value: "/1" },
        { label: "租赁", value: "/2" },
        { label: "失物招领", value: "/3" },
        { label: "预捐赠", value: "/4" },
    ];

    return (
        <>
            <Space size="large" className="navbar">
                <Link href="/" className="title">SJTU 爱心屋</Link>
                <Menu className="menu"
                    selectedKeys={[router.pathname]}
                    mode="horizontal"
                    items={menuItems.map((item) => ({
                        key: item.value,
                        label: <Link href={item.value}>{item.label}</Link>,
                    }))}>
                </Menu>
            </Space>
            <Space size="middle" className="navbar">
                <Button type="text"
                    onClick={() => {changeTheme(userTheme === 'light' ? 'dark' : 'light')}}
                    icon = {userTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                />
                <Button type="primary"  >jAccount 登录</Button>
            </Space>
        </>
    )
}

export default NavBar