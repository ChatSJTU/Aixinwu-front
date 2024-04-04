import Head from "next/head";
import {Col, Row, Space, Typography, Button, Table, Affix, Menu, Collapse, Dropdown, Input, Flex, Grid, Spin} from "antd";
const { Column } = Table;
import {AxCoin} from "@/components/axcoin";
import { EllipsisOutlined } from '@ant-design/icons';
import React, {useContext, useState} from "react";
import { useEffect } from 'react';
import {CheckoutTableList} from "@/components/product-list"
import { OrderProduct } from "@/models/order";
import AuthContext from "@/contexts/auth";
import CartContext from "@/contexts/cart";
import { CheckoutDetail } from "@/models/checkout";
import { checkoutFind } from "@/services/checkout";
import { MessageContext } from "@/contexts/message";
const { Title, Text, Link, Paragraph } = Typography;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

export const OrderPageView = () => {
    const authCtx = useContext(AuthContext);
    const cartCtx = useContext(CartContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);
    const screens = useBreakpoint();
    const [checkout, setCheckout] = useState<CheckoutDetail | undefined>(undefined);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([]);
    const [top, setTop] = React.useState<number>(70);
    const [selectedAddress, setSelectedAddress] = useState<{ name: string; phone: string; address: string; } | null>(null);
    
    // 计算总价
    const calculateTotalCost = (selectedProducts: OrderProduct[]) => {
        const total = selectedProducts.reduce((acc, item) => {
            return acc + (item.cost * item.itemNumber);
        }, 0);
        setTotalCost(total);
   };

    function onClickDelete(id: number) {

        // const newListProduct = listProducts.filter(item => (item.id != id));
        // setListProducts(newListProduct);
    }
 

    function onItemNumberChange(id: number, value: number) {
        // const newListProduct = listProducts.map(
        //     (item) => {
        //         if (item.id === id) {
        //             // 创建一个新的对象，以避免直接修改状态
        //             return {...item, itemNumber: value};
        //         } 
        //         else {
        //             return item;
        //         }
        //     }
        // );
        // setListProducts(newListProduct);

        
    }

    function onItemNumberMinus(id: number) {
        // const newListProduct = listProducts.map(
        //     (item) => {
        //         if (item.id == id) {
        //             item.itemNumber = item.itemNumber - 1;
        //             return item;
        //         }
        //         else {
        //             return item;
        //         }
        //     }
        // );

        // setListProducts(newListProduct);
        // calculateTotalCost(selectedProducts);
    }

    function onItemNumberPlus(id: number) {
        // const newListProduct = listProducts.map(
        //     (item) => {
        //         if (item.id == id) {
        //             item.itemNumber = item.itemNumber + 1;
        //             return item;
        //         }
        //         else {
        //             return item;
        //         }
        //     }
        // );
        // setListProducts(newListProduct);
        // calculateTotalCost(selectedProducts);

    }

    const confirm = (x: OrderProduct) => {
       onClickDelete(x.id)
    };

    const cancel = () => {
    };

    const addresses = [
        {
          name: '谢委屈华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖上海交通大学上海交通大学'
        },
        {
          name: '王潇洒华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '刘爱心华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '黄测吃华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        {
          name: '唐实习华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
        },
        // 添加更多地址
      ];
      
      const handleAddressClick = (address: { name: string, phone: string, address: string }) => {
        setSelectedAddress(address); // 更新选中的地址
    };

     const filteredAddresses = addresses.filter(address => address !== selectedAddress);
    
     const menu = (
        <Menu style={{ maxHeight: "220px", maxWidth: "200px", overflowY: "auto" }}>
          {addresses.map((address, index) => (
            <Menu.Item key={index} onClick={() => handleAddressClick(address)}>
              <p style={{ maxHeight: "300px", overflow: "auto" }}>
                <span>{address.name}</span>
                <span>{address.phone}</span>
                <br />
                <span style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis" }}>{address.address}</span>
              </p>
            </Menu.Item>
          ))}
        </Menu>
      );


    useEffect(() => {
        if (cartCtx.checkoutId != undefined)
        {
            checkoutFind(client!, cartCtx.checkoutId)
                .then(data => setCheckout(data))
                .catch(err => message.error(err));
        }
    }, [cartCtx.checkoutId]);
    
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddress) {
            setSelectedAddress(addresses[0]);
        }
    }, [selectedAddress]);

    if (!checkout) {
        return (
            <center>
                <Spin size="large" style={{ marginTop: '200px' }} />
            </center>
        );
    }

    const OrderComponent = () => {
        return (
                <div className={"container"}>
                    {/* Content of the OrderComponent */}
                    <div> 
                        {/* 地址 */}
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
                                                <Space>
                                                    <span>{selectedAddress ? selectedAddress.name : "请选择地址"}</span>
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
                                              {selectedAddress ? selectedAddress.address: ""}
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
                    
                        <Space align='center' style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                            
                            <Text style={{display: 'flex', alignItems: "center"}}>
                            {/* 总计： <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{totalCost}</span> */}
                            总计： <AxCoin value={totalCost} coloredValue/>
                            </Text>
                            <Button type="primary">提交订单</Button>
                        </Space>
                    </div>
                </div>
        );
    };

    const OrderComponentMobile = () => {
        return (
                <div className={"container"}>
                    {/* Content of the OrderComponent */}
                    <div> 
                        {/* 地址 */}
                                <Collapse defaultActiveKey={["1"]} style={{ marginBottom: "13px" }} ghost size="small">
                                    <Panel header="收货人信息" key="1" style={{ maxHeight: "300px", textOverflow: "ellipsis", fontWeight: "bold" }}>
                                    <Dropdown overlay={menu} trigger={["click"]}>
                                        {/* 点击选择更多地址 */}
                                        
                                        <Button type="text" style={{ width:'100%', maxHeight: "300px",fontWeight: "lighter", height: "auto", overflow:'hidden',  textOverflow: "ellipsis"}}>
                                        <Flex justify='space-between'>
                                            <Space direction="vertical" size="small" style={{ textAlign: "left", maxWidth:'85%', textOverflow:'ellipsis' }}>
                                                <Space>
                                                    <span>{selectedAddress ? selectedAddress.name : "请选择地址"}</span>
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
                                              {selectedAddress ? selectedAddress.address: ""}
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
    };

    
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
            

        </>
    );
    }else{
        return (
        
            <>
            
                <Head>
                    <title>购物车 - 上海交通大学绿色爱心屋</title>
                </Head>
                            {/* 小屏幕 */}


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
                                总计： <AxCoin value={totalCost} coloredValue/>
                            </Text>
                            <Button type="primary">提交订单</Button>
                        </Space>
                    </div>
                    </Row>
            </>
        );
        


        
    }

}

export default OrderPageView;