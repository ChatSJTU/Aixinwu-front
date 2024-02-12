import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

interface PageHeaderProps {
    title: string | JSX.Element;
    onBack?: boolean;
    extra?: JSX.Element
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title, onBack, extra
}) => {
    return (
        <Space style={{ 
            display: 'flex !important', 
            alignItems: 'baseline', 
            padding: "0px 12px 0px 12px",
            height: "32px" }}
        >
            {onBack && <Button
                type="text"
                onClick={() => history.back()}
                icon={<ArrowLeftOutlined />}
            />}
            <div style={{fontWeight: 600, fontSize: '20px'}} className="normal-text">
                {title}
            </div>
            {extra && extra}
        </Space>
    )  
}
