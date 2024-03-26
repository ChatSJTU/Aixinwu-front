import Head from "next/head";
import {Col, Row, Space, InputNumber, Typography, Image, Button, Table, Affix, Popconfirm, Menu, Collapse, Dropdown, Input, Flex, Grid} from "antd";
const { Column } = Table;
import {AxCoin} from "@/components/axcoin";
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import React, {useState} from "react";
import { useRef } from 'react';
import { useEffect } from 'react';
import {OrderProductList} from "@/components/product-list"
import { OrderProduct } from "@/models/order";
const { Title, Text, Link, Paragraph } = Typography;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

export function getProductSummary(key:number, id: number, itemNumber: number) {
    return ({
        key: key,
        id: id,
        itemNumber: itemNumber,
        image_url: ["https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6394/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6457/202306_347.jpg"],
        product: {
            product_name: "新航道2023考研政治900题",
            detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题",
        },
        cost: 24,
        stock: 907,
        subtotal: 0
    });
}

export const OrderPageView = () => {
    var data = [
        getProductSummary(1, 1, 1),
        getProductSummary(2, 2, 2),
        getProductSummary(3, 3, 3),
        getProductSummary(4, 4, 4),
        getProductSummary(5, 5, 5), 
        getProductSummary(6, 6, 6), 
        getProductSummary(7, 7, 7), 
        getProductSummary(8, 8, 8), 
        getProductSummary(9, 9, 9), 
        getProductSummary(10, 10, 10), 
    ];
    const [listProducts, setListProducts] = useState(data);
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

        const newListProduct = listProducts.filter(item => (item.id != id));
        setListProducts(newListProduct);
    }
 

    function onItemNumberChange(id: number, value: number) {
        const newListProduct = listProducts.map(
            (item) => {
                if (item.id === id) {
                    // 创建一个新的对象，以避免直接修改状态
                    return {...item, itemNumber: value};
                } 
                else {
                    return item;
                }
            }
        );
        setListProducts(newListProduct);

        
    }

    function onItemNumberMinus(id: number) {
        const newListProduct = listProducts.map(
            (item) => {
                if (item.id == id) {
                    item.itemNumber = item.itemNumber - 1;
                    return item;
                }
                else {
                    return item;
                }
            }
        );

        setListProducts(newListProduct);
        calculateTotalCost(selectedProducts);
    }

    function onItemNumberPlus(id: number) {
        const newListProduct = listProducts.map(
            (item) => {
                if (item.id == id) {
                    item.itemNumber = item.itemNumber + 1;
                    return item;
                }
                else {
                    return item;
                }
            }
        );
        setListProducts(newListProduct);
        calculateTotalCost(selectedProducts);

    }
   
    // 在选择框变化时更新选中的商品列表
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        const newSelectedProducts = listProducts.filter((item) => newSelectedRowKeys.includes(item.key));
        setSelectedProducts(newSelectedProducts);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
    };

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
        calculateTotalCost(selectedProducts);
        // calculateTotalCost();
        if (addresses.length > 0 && !selectedAddress) {
            setSelectedAddress(addresses[0]);
        }
    }, [selectedProducts, selectedAddress]);

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

    const screens = useBreakpoint();
    
    if (screens.md) {

    return (
        
        <>
        
            <Head>
                <title>预捐赠 - 上海交通大学绿色爱心屋</title>
            </Head>
            <Row>
                <Col xs={24} sm={24} md={18}>
            
                    <OrderProductList 
                    OrderListProducts={listProducts}
                    onClickDelete={onClickDelete}
                    onItemNumberChange={onItemNumberChange}
                    onItemNumberMinus={onItemNumberMinus}
                    onItemNumberPlus={onItemNumberPlus}
                    rowSelection={rowSelection}
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
                    <title>预捐赠 - 上海交通大学绿色爱心屋</title>
                </Head>
                            {/* 小屏幕 */}


                    <Row>
                        <Col sm={24} xs={24}>
                                <OrderComponentMobile />
                        </Col>

                        <Col xs={24} sm={24}>

                            <OrderProductList 
                            OrderListProducts={listProducts}
                            onClickDelete={onClickDelete}
                            onItemNumberChange={onItemNumberChange}
                            onItemNumberMinus={onItemNumberMinus}
                            onItemNumberPlus={onItemNumberPlus}
                            rowSelection={rowSelection}
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