import { Typography } from "antd";

const { Title } = Typography;

export const HomeLeftContent = () => {
    return (
        <>
            <div className="container homecontent">
                <Title level={5} style={{marginTop: '-6px'}}>通知</Title>
            </div>
            <div className="container homecontent">
                <Title level={5} style={{marginTop: '-6px'}}>动态</Title>
            </div>
        </>
    )
}