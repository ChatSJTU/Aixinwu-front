import React, { useEffect, useState, useContext } from "react";
import { Carousel, Col, Row, Statistic, Image } from "antd";
import { AxCoin } from "./axcoin";
import { fetchCarouselUrls, fetchStatistics } from "@/services/homepage";
import { SiteStatistics } from "@/models/site-statistics";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';

const HomeBanner = () => {
    const [carouselUrls, setCarouselUrls] = useState<string[]>([]);
    const [statistics, setStatistics] = useState<SiteStatistics | null>(null);
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;

    useEffect(() => {
        fetchCarouselUrls(client!)
            .then(res => setCarouselUrls(res))
            .catch(err => message.error(err));
        fetchStatistics(client!)
            .then(res => setStatistics(res))
            .catch(err => message.error(err));
        }
    , []);

    const contentStyle: React.CSSProperties = {
        height: "326px",
        color: "#fff",
        lineHeight: "326px",
        textAlign: "center",
        margin: "0px",
        background: "#364d79",
        position: "relative",
        overflow: "hidden",
    };
    
    const blurBackgroundStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        backgroundSize: "cover",
        filter: "blur(30px)",
        transform: "scale(1.2)",
        zIndex: 1,
    };
    
    const foregroundImageStyle: React.CSSProperties = {
        position: "relative",
        height: "326px",
        width: "auto",
        objectFit: "cover",
        zIndex: 2,
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
                        {carouselUrls.length != 0 &&
                            carouselUrls.map((url, index) => (
                                <>
                                    <div key={index} style={contentStyle}>
                                        <div style={{ ...blurBackgroundStyle, backgroundImage: `url(${url})` }} />
                                        <Image
                                            src={url}
                                            style={foregroundImageStyle}
                                            preview={false}
                                            alt={`carousel-${index}`}
                                        />
                                    </div>
                                </>
                            ))
                        }
                        {carouselUrls.length == 0 &&
                            <>
                                <div style={contentStyle}>
                                    <h3>No Active Carousels</h3>
                                </div>
                            </>
                        }
                    </Carousel>
                </div>
            </Col>
            <Col span={6}>
                {/* value for test */}
                <div className="container homebanner" style={{paddingBottom: "10px"}}>
                    <Statistic title="共流转物品" value={statistics ? statistics.circulatedItems : 0} suffix="件"/>
                    <Statistic title="总计置换" value={statistics ? statistics.circulatedCurrency : 0} prefix={<AxCoin/>}/>
                    <Statistic title="注册用户" value={statistics ? statistics.users : 0} suffix="人"/>
                    <Statistic title="访问用户" value={statistics ? statistics.views : 0} suffix="人次"/>
                </div>
            </Col>
        </Row>
    )
}

export default HomeBanner;