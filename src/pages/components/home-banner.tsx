import { Carousel, Col, Row, Statistic } from 'antd';

const HomeBanner = () => {
    const contentStyle: React.CSSProperties = {
        height: '240px',
        color: '#fff',
        lineHeight: '240px',
        textAlign: 'center',
        background: '#364d79',
    };

    return (
        <Row>
            <Col span={5}>
                <div className='container homebanner'></div>
            </Col>
            <Col span={14}>
                <div className='container homebanner'>
                    <Carousel effect="fade">
                        <div>
                            <h3 style={contentStyle}>1</h3>
                        </div>
                    </Carousel>
                </div>
            </Col>
            <Col span={5}>
                {/* value for test */}
                <div className='container homebanner' style={{paddingBottom: '10px'}}>
                    <Statistic title="共流转物品" value={4239155}/>
                    <Statistic title="总计置换" value={14646661.55}/>
                    <Statistic title="注册用户" value={65644}/>
                    <Statistic title="访问用户" value={5475954}/>
                </div>
            </Col>
        </Row>
    )
}

export default HomeBanner;