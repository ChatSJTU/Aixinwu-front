import React, { useEffect, useState, useContext } from "react";
import { Carousel, Image, Flex, Button, Space } from "antd";
import { useRouter } from "next/router";
import { fetchCarouselUrls } from "@/services/homepage";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { UserOutlined, ShoppingOutlined, FileTextOutlined, HourglassOutlined } from "@ant-design/icons";

const HomeBannerMobile = () => {
    const [carouselUrls, setCarouselUrls] = useState<string[]>([]);
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;
    const router = useRouter();

    useEffect(() => {
        fetchCarouselUrls(client!)
            .then(res => setCarouselUrls(res))
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
      <div>
        <div className="container homebanner" style={{padding: '12px 12px 0px 12px', marginBottom: '24px'}} >
          <Flex align="center" justify="space-between">
            <Button 
              type="text" style={{height: "auto"}} size="middle"
              onClick={()=>{router.push("/products/"+process.env.NEXT_PUBLIC_CHANNEL)}}
            >
              <Space direction="vertical">
                <ShoppingOutlined style={{fontSize: "36px"}} className="thin-icon"/>
                置换
              </Space>
            </Button>
            <Button 
              type="text" style={{height: "auto"}} size="middle"
              onClick={()=>{router.push("/products/"+process.env.NEXT_PUBLIC_CHANNEL2)}}
            >
              <Space direction="vertical">
                <HourglassOutlined style={{fontSize: "36px"}}/>
                租赁
              </Space>
            </Button>
            <Button 
              type="text" style={{height: "auto"}} size="middle"
              onClick={()=>{router.push("/articles/")}}
            >
              <Space direction="vertical">
                <FileTextOutlined style={{fontSize: "36px"}}/>
                通知
              </Space>
            </Button>
            <Button 
              type="text" style={{height: "auto"}} size="middle"
              onClick={()=>{router.push("/user/")}}
            >
              <Space direction="vertical">
                <UserOutlined style={{fontSize: "36px"}}/>
                我的
              </Space>
            </Button>
          </Flex>
        </div>
        <div className="container homebanner" style={{padding: '0px', marginBottom: '24px'}}>
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
      </div>
    )
}

export default HomeBannerMobile;