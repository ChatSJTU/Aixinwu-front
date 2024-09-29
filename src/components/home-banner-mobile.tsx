import React, { useEffect, useState, useContext } from "react";
import { Carousel, Image, Flex, Button, Space, Alert } from "antd";
import { useRouter } from "next/router";
import { fetchCarouselUrls } from "@/services/homepage";
import { fetchUserBasicInfo } from "@/services/user";
import { UserBasicInfo } from "@/models/user";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import Icon from "@ant-design/icons";
import icon_page from '../../assets/icons/page.svg'
import icon_share from '../../assets/icons/share.svg'
import icon_store from '../../assets/icons/store.svg'
import icon_user from '../../assets/icons/user.svg'

const HomeBannerMobile = () => {
    const [carouselUrls, setCarouselUrls] = useState<string[]>([]);
    const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo | undefined>(undefined);
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

    return (
      <div>
        {userBasicInfo?.unpicked_order_count && userBasicInfo?.unpicked_order_count > 0 &&
          <Alert 
            message={`${userBasicInfo?.unpicked_order_count} 笔订单待取货`}
            type="warning" 
            showIcon
            banner
            action={
              <Button size="small" type="link" onClick={() => {router.push('/user/order')}}>
                查看
              </Button>
            }
          />
        }
        <div className="container homebanner" style={{padding: '12px 12px 12px 12px', marginBottom: '24px'}} >
          <Flex align="center" justify="space-between">
            <Button 
              type="text" style={{height: "auto"}} size="large"
              onClick={()=>{router.push("/products/"+process.env.NEXT_PUBLIC_CHANNEL)}}
            >
              <Space direction="vertical">
                <Icon component={icon_store} style={{fontSize: "48px"}} className="thin-icon"/>
                置换
              </Space>
            </Button>
            <Button 
              type="text" style={{height: "auto"}} size="large"
              onClick={()=>{router.push("/products/"+process.env.NEXT_PUBLIC_CHANNEL2)}}
            >
              <Space direction="vertical">
                <Icon component={icon_share} style={{fontSize: "48px"}} className="thin-icon"/>
                租赁
              </Space>
            </Button>
            <Button 
              type="text" style={{height: "auto"}} size="large"
              onClick={()=>{router.push("/articles/")}}
            >
              <Space direction="vertical">
                <Icon component={icon_page} style={{fontSize: "48px"}} className="thin-icon"/>
                通知
              </Space>
            </Button>
            <Button 
              type="text" style={{height: "auto"}} size="large"
              onClick={()=>{router.push("/user/")}}
            >
              <Space direction="vertical">
                <Icon component={icon_user} style={{fontSize: "48px"}} className="thin-icon"/>
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