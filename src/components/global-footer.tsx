import { Divider, Space, Grid, QRCode, Row, Col } from "antd"
import { PhoneOutlined, MailOutlined, ShopOutlined, ClockCircleOutlined } from "@ant-design/icons"
import Link from "next/link";

const Developer = () => (
    <div>Supported by <Link target="_blank" href="https://github.com/ChatSJTU" style={{color: "inherit", textDecoration: "none"}} >上海交通大学绿色爱心屋学生开发团队</Link></div>
);

const GlobalFooter = () => {
  const screens = Grid.useBreakpoint();
    return (
        <>
            <Divider/>
            <Row>
                <Col span={screens.md ? 5 : 8}>
                    <Space direction="vertical">
                        <div className="footer-map-title">服务</div>
                        {/* TODO: change route */}
                        <Link href={"/products/"+process.env.NEXT_PUBLIC_CHANNEL} className="footer-map-item">置换</Link>
                        <Link href={"/products/"+process.env.NEXT_PUBLIC_CHANNEL2} className="footer-map-item">租赁</Link>
                        {/* <Link href="/" className="footer-map-item">失物招领</Link> */}
                        {/* <Link href="/pre-donate" className="footer-map-item">预捐赠</Link> */}
                    </Space>
                </Col>
                <Col span={screens.md ? 5 : 8}>
                    <Space direction="vertical">
                        <div className="footer-map-title">特色活动</div>
                        <Link href="/" className="footer-map-item">寒假路补</Link>
                        <Link href="/" className="footer-map-item">新生大礼包</Link>
                        <Link href="/" className="footer-map-item">合作项目展示</Link>
                    </Space>
                </Col>
                <Col span={screens.md ? 5 : 8}>
                    <Space direction="vertical">
                        <div className="footer-map-title">关于</div>
                        <Link href="/articles" className="footer-map-item">通知公告</Link>
                        <Link href="/about" className="footer-map-item">SJTU 绿色爱心屋</Link>
                        {/* <Link href="https://aixinwu.info/" target="_blank" className="footer-map-item">爱心屋联盟</Link> */}
                    </Space>
                </Col>
            </Row>
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
                        bordered={false} size={75}
                        value="http://weixin.qq.com/r/B3UaAl7EywO0rRph9yAV"
                    />
                    <Space direction="vertical">
                        <div><ShopOutlined /> 闵行校区学生服务中心一楼</div>
                        <div style={{wordBreak: "break-all", overflowWrap: "break-word"}}>
                            <ClockCircleOutlined /> 8:20-19:50&nbsp;&nbsp;&nbsp;
                            <PhoneOutlined style={{transform: "scaleX(-1)"}}/> 021-54745672&nbsp;&nbsp;&nbsp;
                            <MailOutlined /> <Link className="footer-link" href="mailto:aixinwu@sjtu.edu.cn">aixinwu@sjtu.edu.cn</Link>
                        </div>
                        {!screens.md && <Developer/>}
                        <div>Copyright ©{new Date().getFullYear()} 上海交通大学绿色爱心屋 | 沪交ICP备20111144</div>
                    </Space>
                </Space>
                {screens.md && <Developer/>}
            </div>
        </>
    )
}

export default GlobalFooter;