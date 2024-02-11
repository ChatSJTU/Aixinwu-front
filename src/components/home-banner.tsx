import { Carousel, Col, Row, Statistic } from "antd";
import { AxCoin } from "./axcoin";

const HomeBanner = () => {
    const contentStyle: React.CSSProperties = {
        height: "326px",
        color: "#fff",
        lineHeight: "326px",
        textAlign: "center",
        margin: "0px",
        background: "#364d79",
    };

    return (
        <Row>
            <Col span={6}>
                <div className="container homebanner">
                </div>
            </Col>
            <Col span={12}>
                <div className="container homebanner" style={{padding: '0px'}}>
                    <Carousel autoplay
                        autoplaySpeed={7000} speed={1500}
                        effect="fade"
                    >
                        <div>
                            <h3 style={contentStyle}>1</h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>2</h3>
                        </div>
                    </Carousel>
                </div>
            </Col>
            <Col span={6}>
                {/* value for test */}
                <div className="container homebanner" style={{paddingBottom: "10px"}}>
                    <Statistic title="共流转物品" value={4239155} suffix="件"/>
                    <Statistic title="总计置换" value={14646661.55} prefix={<AxCoin/>}/>
                    <Statistic title="注册用户" value={65644} suffix="人"/>
                    <Statistic title="访问用户" value={5475954} suffix="人次"/>
                </div>
            </Col>
        </Row>
    )
}

export default HomeBanner;