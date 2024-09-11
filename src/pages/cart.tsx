import Head from "next/head";
import { Col, Row, Space, Typography, Button, Table, Affix, Menu, Collapse, Dropdown, Input, Flex, Grid, Spin } from "antd";
import { AxCoin } from "@/components/axcoin";
import { EllipsisOutlined } from '@ant-design/icons';
import React, {useContext, useState} from "react";
import { useEffect } from 'react';
import { CheckoutTableList } from "@/components/product-list"
import AuthContext from "@/contexts/auth";
import CartContext from "@/contexts/cart";
import { CheckoutDetail } from "@/models/checkout";
import { checkoutAddressUpdate, checkoutDeleteLine, checkoutFind, checkoutUpdateLine } from "@/services/checkout";
import { MessageContext } from "@/contexts/message";
import { useRouter } from "next/router";
import { fetchUserAddresses } from "@/services/user";
import { AddressInfo } from "@/models/address";
import { CheckoutCompleteModal } from "@/components/checkout-complete-modal";
import { NotificationContext } from "@/contexts/notification";
const { Title, Text, Link, Paragraph } = Typography;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

export const OrderPageView = () => {
    const router = useRouter();
    const authCtx = useContext(AuthContext);
    const cartCtx = useContext(CartContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);
    const notification = useContext(NotificationContext);
    const screens = useBreakpoint();
    const [checkout, setCheckout] = useState<CheckoutDetail | undefined>(undefined);
    const [top, setTop] = React.useState<number>(70);
    const [selectedAddress, setSelectedAddress] = useState<AddressInfo | undefined>(undefined);
    const [addresses, setAddresses] = useState<AddressInfo[]>([]);
    const [isCompleteModalOpen, setCompleteModalOpen] = useState<boolean>(false);
    
    function updateCheckoutAndCartNum(checkout: CheckoutDetail) {
        //cartCtx.setCheckoutId(checkout.id);
        cartCtx.setTotalQuantity(checkout.quantity);
        setCheckout(checkout);
    }

    function onClickDelete(id: string) {
        if (checkout == undefined)
        {
            message.error("操作失败：购物车不存在。请刷新页面重试！");
            return;
        }
        var line = checkout.lines?.find(x=>x.id == id);
        if (line == undefined)
        {
            message.error("操作失败：商品不存在。请刷新页面重试！");
            return;
        }
        checkoutDeleteLine(client!, checkout.id, id)
            .then(data => updateCheckoutAndCartNum(data))
            .catch(err => message.error(err));
    }
 

    function onItemNumberChange(id: string, value: number) {
        if (checkout == undefined)
        {
            message.error("操作失败：购物车不存在。请刷新页面重试！");
            return;
        }
        var line = checkout.lines?.find(x=>x.id == id);
        if (line == undefined)
        {
            message.error("操作失败：商品不存在。请刷新页面重试！");
            return;
        }
        if (value <= 0)
        {
            message.error("操作失败：数量必须是正整数");
            return;
        }
        checkoutUpdateLine(client!, checkout.id, id, value)
            .then(data => updateCheckoutAndCartNum(data))
            .catch(err => message.error(err));
    }

    //Todo: 响应用户连点操作，延迟发送请求
    function onItemNumberMinus(id: string) {
        if (checkout == undefined)
        {
            message.error("操作失败：购物车不存在。请刷新页面重试！");
            return;
        }
        var line = checkout.lines?.find(x=>x.id == id);
        if (line == undefined)
        {
            message.error("操作失败：商品不存在。请刷新页面重试！");
            return;
        }
        var value = line.quantity - 1;
        if (value <= 0)
        {
            message.error("操作失败：商品数量已达到最小值");
            return;
        }
        checkoutUpdateLine(client!, checkout.id, id, value)
            .then(data => updateCheckoutAndCartNum(data))
            .catch(err => message.error(err));
    }

    function onItemNumberPlus(id: string) {
        if (checkout == undefined)
        {
            message.error("操作失败：购物车不存在。请刷新页面重试！");
            return;
        }
        var line = checkout.lines?.find(x=>x.id == id);
        if (line == undefined)
        {
            message.error("操作失败：商品不存在。请刷新页面重试！");
            return;
        }
        var value = line.quantity + 1;
        if (value > 50)
        {
            message.error("操作失败：商品数量已达到最大值");
            return;
        }
        checkoutUpdateLine(client!, checkout.id, id, value)
            .then(data => updateCheckoutAndCartNum(data))
            .catch(err => message.error(err));
    }

    function updateSelectedAddress(addr: AddressInfo) {
        if (checkout == undefined)
        {
            return;
        }
        checkoutAddressUpdate(client!, checkout.id, addr)
            .then(data => { setSelectedAddress(addr); setCheckout(data); })
            .catch(err => message.error(err));
    }

    const handleAddressClick = (addr: AddressInfo) => {
        updateSelectedAddress(addr);
    };

    const handleSubmitClick = () => {
        if (checkout == undefined)
        {
            message.error("操作失败：购物车不存在。请刷新页面重试！");
            return;
        }
        if (selectedAddress == undefined)
        {
            message.error("操作失败：请先选择收货地址。");
            return;
        }
        setCompleteModalOpen(true);
    }

    const handleCompleteModalClose = () => {
        setCompleteModalOpen(false);
    }

    useEffect(() => {
        if (cartCtx.checkoutId == undefined)
            cartCtx.doRefresh();
    });

    useEffect(() => {
        if (cartCtx.checkoutId != undefined)
        {
            checkoutFind(client!, cartCtx.checkoutId)
                .then(data => updateCheckoutAndCartNum(data))
                .catch(err => {
                    message.error(err);
                    cartCtx.incrCartError();
                });
        }
    }, [cartCtx.checkoutId, router]);

    useEffect(() => {
        if (!authCtx.isLoggedIn)
            router.push("/403")
        fetchUserAddresses(client!)
            .then(data => {
                setAddresses(data);
                if (data.length == 0) {
                    const key = `open${Date.now()}`;
                    const btn = (
                        <Button type="primary" size="middle" onClick={() => {
                            notification.destroy(key);
                            router.push("/user/consignee")
                        }}>
                            前往收货地址管理
                        </Button>
                    );
                    notification.warning({
                        message: '未找到收货地址',
                        description:
                          '您必须至少添加一个收货地址才能下单商品。',
                        btn,
                        key,
                    })
                }
            })
            .catch(err => message.error(err));
    }, [cartCtx.checkoutId, router]);
    
    useEffect(() => {
        if (!addresses || addresses.length == 0)
            return;
        if (checkout == undefined || !checkout.isShippingRequired)
            return;
        if (selectedAddress == undefined) {
            if (checkout?.shippingAddress == undefined)
            {
                updateSelectedAddress(addresses.find(x=>x.isDefaultShippingAddress)!);
            }
            else
            {
                setSelectedAddress(checkout?.shippingAddress);
            }
        }
    }, [checkout, addresses]);

    const menu = (
        <Menu style={{ maxHeight: "220px", maxWidth: "200px", overflowY: "auto" }}>
          {addresses.map((address, index) => (
            <Menu.Item key={index} onClick={() => handleAddressClick(address)}>
              <p style={{ maxHeight: "300px", overflow: "auto" }}>
                <span>{address.firstName}</span>
                <span>{address.phone}</span>
                <br />
                <span style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis" }}>{address.streetAddress1}</span>
              </p>
            </Menu.Item>
          ))}
        </Menu>
    );

    if (!checkout) {
        return (
            <center>
                <Spin size="large" style={{ marginTop: '200px' }} />
            </center>
        );
    }
    
    const OrderComponent = () => (
        <div className={"container"}>
            <div> 
                <Collapse defaultActiveKey={["1"]} style={{ marginBottom: "13px" }} ghost size="small">
                    <Panel header="收货人信息" key="1" style={{ maxHeight: "300px", textOverflow: "ellipsis", fontWeight: "bold" }}>
                    <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    >
                    <Button
                        type="text"
                        style={{ width: '100%', fontWeight: "lighter", height: "auto", overflow:'hidden',  textOverflow: "ellipsis"}}
                    >
                        <Flex justify='space-between'>
                            <Space direction="vertical" size="small" style={{ textAlign: "left", maxWidth:'85%', textOverflow:'ellipsis' }}>
                                {
                                    selectedAddress ?
                                    (
                                        <>
                                        <Space>
                                            <span>{selectedAddress.firstName}</span>
                                            <span>{selectedAddress.phone}</span>
                                        </Space>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <span>{"请选择地址"}</span>
                                        </>
                                    )
                                }
                            {
                                selectedAddress && (
                                    <Paragraph style={{ 
                                        fontSize: "12px", 
                                        color: "gray", 
                                        whiteSpace:'pre-wrap',
                                        marginBottom:'4px'
                                        }}
                                        ellipsis={{rows:2, expandable:false}}>
                                        {selectedAddress.streetAddress1}
                                    </Paragraph>
                                )
                            }
                            </Space>                                                                                 
                            <EllipsisOutlined/>
                        </Flex>  
                        </Button>
                           
                        </Dropdown>
                    </Panel>        

                    <Panel header="订单备注" key="2" style={{ maxHeight: '150px', fontWeight: 'bold'}}>
                        <Input.TextArea rows={4} style={{maxHeight: '100px', overflow: 'auto'}}/>
                    </Panel>
                </Collapse>
                <Space align='center' style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                    <Text style={{display: 'flex', alignItems: "center"}}>
                    {/* 总计： <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{totalCost}</span> */}
                    总计： <AxCoin value={checkout.totalPrice.gross.amount} coloredValue/>
                    </Text>
                    <Button type="primary" onClick={handleSubmitClick}>提交订单</Button>
                </Space>
            </div>
        </div>
    );

    const OrderComponentMobile = () => (
        <div className={"container"}>
            <div>
                <Collapse defaultActiveKey={["1"]} style={{ marginBottom: "13px" }} ghost size="small">
                    <Panel header="收货人信息" key="1" style={{ maxHeight: "300px", textOverflow: "ellipsis", fontWeight: "bold" }}>
                    <Dropdown overlay={menu} trigger={["click"]}>
                        {/* 点击选择更多地址 */}
                        <Button type="text" style={{ width:'100%', maxHeight: "300px",fontWeight: "lighter", height: "auto", overflow:'hidden',  textOverflow: "ellipsis"}}>
                        <Flex justify='space-between'>
                            <Space direction="vertical" size="small" style={{ textAlign: "left", maxWidth:'85%', textOverflow:'ellipsis' }}>
                                <Space>
                                    <span>{selectedAddress ? selectedAddress.firstName : "请选择地址"}</span>
                                    <span>{selectedAddress ? selectedAddress.phone : ""}</span>
                                </Space>
                                {/* 地址 */}
                            <Paragraph style={{ 
                              fontSize: "12px", 
                              color: "gray", 
                              whiteSpace:'pre-wrap',
                               marginBottom:'4px'
                              }}
                              ellipsis={{rows:2, expandable:false}}>
                              {selectedAddress ? selectedAddress.streetAddress1: ""}
                            </Paragraph>
                            </Space>                                                                                 
                                <EllipsisOutlined/>
                        </Flex> 
                        </Button>
                           
                        </Dropdown>
                    </Panel>        

                    <Panel header="订单备注" key="2" style={{ maxHeight: '150px', fontWeight: 'bold'}}>
                        <Input.TextArea rows={4} style={{maxHeight: '100px', overflow: 'auto'}}/>
                    </Panel>  
                </Collapse>
            </div>
        </div>
    );

    if (screens.md) {
        return (
            <>
                <Head>
                    <title>购物车 - 上海交通大学绿色爱心屋</title>
                </Head>
                <Row>
                    <Col xs={24} sm={24} md={18}>
                    <CheckoutTableList 
                                CheckoutLines={checkout.lines!}
                                onClickDelete={onClickDelete}
                                onItemNumberChange={onItemNumberChange}
                                onItemNumberMinus={onItemNumberMinus}
                                onItemNumberPlus={onItemNumberPlus}
                                />   
                    </Col>
                    <Col xs={24} sm={24} md={6}>
                        <Affix offsetTop={top}>
                            <OrderComponent />
                        </Affix>                    
                    </Col>
                </Row>
                <CheckoutCompleteModal isopen={isCompleteModalOpen} checkout={checkout} onClose={handleCompleteModalClose}/>
            </>
        );
    }
    else
    {
        return (
            <>
                <Head>
                    <title>购物车 - 上海交通大学绿色爱心屋</title>
                </Head>
                <Row>
                    <Col sm={24} xs={24}>
                        <OrderComponentMobile />
                    </Col>
                    <Col xs={24} sm={24}>
                        <CheckoutTableList 
                        CheckoutLines={checkout.lines!}
                        onClickDelete={onClickDelete}
                        onItemNumberChange={onItemNumberChange}
                        onItemNumberMinus={onItemNumberMinus}
                        onItemNumberPlus={onItemNumberPlus}
                        />               
                    </Col>

                    <div style={{ position: 'fixed', bottom: 0, width: '100%', background: '#fff', padding: '20px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <Space align='center' style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                            <Text style={{ display: 'flex', alignItems: "center" }}>
                                总计： <AxCoin value={checkout.totalPrice.gross.amount} coloredValue/>
                            </Text>
                            <Button type="primary" onClick={handleSubmitClick}>提交订单</Button>
                        </Space>
                    </div>
                </Row>
                <CheckoutCompleteModal isopen={isCompleteModalOpen} checkout={checkout} onClose={handleCompleteModalClose}/>
            </>
        );
    }
}

export default OrderPageView;