import { Typography } from "antd";

const { Title } = Typography;

export const HomeLeftContent = () => {
    return (
        <>
            <div className="container basic-card">
                <Title level={5}>通知</Title>
            </div>
            <div className="container basic-card">
                <Title level={5}>动态</Title>
            </div>
        </>
    )
}