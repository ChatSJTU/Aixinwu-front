import { Space, Menu, Button } from 'antd';
import { useRouter } from "next/router";
import Link from "next/link";

const NavBar = () => {
    const router = useRouter();

    const menuItems = [
        { label: "置换", value: "/1" },
        { label: "租赁", value: "/2" },
        { label: "失物招领", value: "/3" },
        { label: "预捐赠", value: "/4" },
    ];

    return (
        <>
            <Space className="navbar">
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
            <Button type="primary">jAccount 登录</Button>
        </>
    )
}

export default NavBar