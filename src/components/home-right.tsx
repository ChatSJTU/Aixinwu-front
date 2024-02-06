import { Typography } from "antd";

const { Title } = Typography;

export const HomeRightContent = () => {
    return (
        <>
            <div className="container homecontent">
                <Title level={5} style={{marginTop: '-6px'}}>热门置换</Title>
            </div>
            <div className="container homecontent">
                <Title level={5} style={{marginTop: '-6px'}}>租赁专区</Title>
            </div>
        </>
    )
}