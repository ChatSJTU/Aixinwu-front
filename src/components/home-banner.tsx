import React, { useEffect, useState, useContext } from "react";
import { Carousel, Col, Row, Statistic, Image, Tag, Typography, Space, Avatar, Button, Skeleton, Alert } from "antd";
import { UserOutlined, ContainerOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { AxCoin } from "@/components/axcoin";
import { fetchCarouselUrls, fetchStatistics } from "@/services/homepage";
import { fetchUserBasicInfo } from "@/services/user";
import { SiteStatistics } from "@/models/site-statistics";
import { UserBasicInfo } from "@/models/user";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import ThemeContext from '@/contexts/theme';
import { tagStyle } from "@/components/user-basic-info-card";

const { Title } = Typography;

const HomeBanner = () => {
    const [carouselUrls, setCarouselUrls] = useState<string[]>([]);
    const [statistics, setStatistics] = useState<SiteStatistics | null>(null);
    const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo | undefined>(undefined);
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const theme = useContext(ThemeContext);
    const client = authCtx.client;
    const router = useRouter();

    useEffect(() => {
        fetchCarouselUrls(client!)
            .then(res => setCarouselUrls(res))
            .catch(err => message.error(err));
        fetchStatistics(client!)
            .then(res => setStatistics(res))
            .catch(err => message.error(err));   
    }, []);

    useEffect(() => {
        if (authCtx.isLoggedIn) {
            fetchUserBasicInfo(client!)
            .then(data => {
                setUserBasicInfo(data)
                authCtx.updateUserInfo(data)
            })
            .catch(err => {
                message.error(err);
                setUserBasicInfo(undefined);
            })
        } else {
            setUserBasicInfo(undefined);
        }
    }, [authCtx.isLoggedIn])

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

    const overlayStyle: React.CSSProperties = {
        position: 'absolute',
        top: 13,
        left: 13,
        right: 13,
        bottom: 13,
        background: theme.userTheme == 'light' ? 'rgba(255, 255, 255, 0.55)' : 'rgba(40, 40, 40, 0.55)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backdropFilter: 'blur(7px)', 
        borderRadius: '7px',
        overflow: 'hidden',
      };

    const tag = userBasicInfo != null ? (tagStyle[userBasicInfo?.type] || { text: '未知', color: 'default' }) : { text: '未知', color: 'default' };

    const userQuickLink = [
        {
            label: '订单',
            key: '/user/order',
            icon: <ContainerOutlined />
        },
        {
            label: '爱心篮',
            key: '/cart',
            icon: <ShoppingCartOutlined />
        },
        {
            label: '我的',
            key: '/user',
            icon: <UserOutlined/>
        }
    ]

    return (
        <Row>
            <Col span={6}>
                <div className="container homebanner">
                    <Space direction="vertical" style={{alignItems: "center", width: "100%"}}>
                        <Avatar shape="square" size={60} icon={<UserOutlined />} />
                        <Space style={{marginTop: "12px"}}>
                            <Title level={5} style={{margin: "0px"}}>{userBasicInfo?.name ?? <Skeleton.Input size="small"/>}</Title>
                            <Tag color={tag.color}>{tag.text}</Tag>
                        </Space>
                        <span>{userBasicInfo?.email ?? <Skeleton.Input size="small"/>}</span>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>账户余额：</span>
                            <AxCoin size={14} 
                                value={userBasicInfo?.balance ?? 0}
                                coloredValue
                                valueStyle={{
                                    margin: '0px 0px 0px -4px',
                                    fontSize: '14px',
                                }}/>
                        </div>
                        <Row style={{marginTop: "12px"}}>
                            {userQuickLink.slice(0, 3).map(item => (
                                <Col key={item.key} span={8}>
                                    <Button 
                                        type="text" style={{height: "auto", width: "100%"}} size="small"
                                        onClick={() => {router.push(item.key)}}
                                        >
                                        <div style={{marginInline: "12px"}}>
                                            <div style={{fontSize: "16px"}}>{item.icon}</div>
                                            {item.label}
                                        </div>
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                        <div
                            style={{
                                border: '2px dashed',
                                borderColor: userBasicInfo?.unpicked_order_count && userBasicInfo?.unpicked_order_count > 0 
                                    ? 'rgba(128, 0, 128, 0.4)' 
                                    : (theme.userTheme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'),
                                borderRadius: '8px',
                                backgroundColor: userBasicInfo?.unpicked_order_count && userBasicInfo?.unpicked_order_count > 0
                                    ? 'rgba(128, 0, 128, 0.06)'
                                    : (theme.userTheme === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.04)'),
                                marginTop: "8px",
                                padding: '10px',
                                textAlign: 'center',
                                height: '40px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {userBasicInfo?.unpicked_order_count && userBasicInfo?.unpicked_order_count > 0 ? (
                                <Space style={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis', 
                                    width: '100%',
                                }}>
                                    <p style={{ fontSize: '16px', fontWeight: 'bold', display: 'inline' }}>
                                        {userBasicInfo?.unpicked_order_count}
                                    </p>
                                    <span style={{ display: 'inline' }}>笔订单待取货</span>
                                    <Button 
                                        type='link' 
                                        onClick={() => {router.push('/user/order')}}
                                        style={{ padding: 0, display: 'inline' }}
                                    >
                                        查看
                                    </Button>
                                </Space>
                            ) : (
                                <div>&nbsp;&nbsp;当前无待取货订单&nbsp;&nbsp;</div>
                            )}
                        </div>
                    </Space>
                    {!authCtx.isLoggedIn && (
                        <div style={overlayStyle}>
                        <Button type="link" onClick={() => {authCtx.doExternalLogin}}>
                            请先登录
                        </Button>
                        </div>
                    )}
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