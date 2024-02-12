import { Typography } from "antd";

const { Title } = Typography;

export const HomeRightContent = () => {
    return (
        <>
            <div className="container basic-card">
                <Title level={5}>热门置换</Title>
            </div>
            <div className="container basic-card">
                <Title level={5}>租赁专区</Title>
            </div>
        </>
    )
}