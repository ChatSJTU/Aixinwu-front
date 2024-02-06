import { Divider, Space, Typography, QRCode } from "antd"
import { PhoneOutlined, MailOutlined, ShopOutlined, WechatOutlined } from "@ant-design/icons"

const { Link } = Typography;

const GlobalFooter = () => {
    return (
        <>
            <Divider/>
            <div style={{
                display: "flex", 
                justifyContent: "space-between", 
            }}>
                <Space size="large" style={{
                    display:"flex", 
                    alignItems: "flex-start", 
                    padding: "0px !important"
                    }}
                >
                    <QRCode 
                        bordered={false} size={60}
                        value="http://weixin.qq.com/r/B3UaAl7EywO0rRph9yAV"
                    />
                    <Space direction="vertical">
                        <div>
                            <ShopOutlined /> 学生服务中心一楼（邮政隔壁）&nbsp;
                            <PhoneOutlined style={{transform: "scaleX(-1)"}}/> 021-54745672&nbsp;&nbsp;&nbsp;
                            <MailOutlined /> <Link className="footer-link" href="mailto:aixinwu@sjtu.edu.cn">aixinwu@sjtu.edu.cn</Link>
                        </div>
                        <div>Copyright ©{new Date().getFullYear()} 上海交通大学爱心屋 | 沪交ICP备XXXXXXXX</div>
                    </Space>
                </Space>
                <div>Supported by Chat SJTU Team</div>
            </div>
        </>
    )
}

export default GlobalFooter;