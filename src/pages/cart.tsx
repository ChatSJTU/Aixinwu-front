import Head from "next/head";
import {Col, Row, Space, InputNumber, Typography, Image, Button, Table, Affix, Popconfirm, Menu, Collapse, Dropdown, Input} from "antd";
const { Column } = Table;
import {AxCoin} from "@/components/axcoin";
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import React, {useState} from "react";
import { useEffect } from 'react';
const { Title, Text, Link, Paragraph } = Typography;
const { Panel } = Collapse;



export interface product {
    key: React.Key,
    id: number,
    itemNumber: number,
    image_url: string[],
    product : {
        product_name: string,
        detailed_product_name: string
    }
    cost: number
    stock: number
    subtotal: number
}


export function getProductSummary(key:number, id: number, itemNumber: number) {
    return ({
        key: key,
        id: id,
        itemNumber: itemNumber,
        image_url: ["https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6394/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6457/202306_347.jpg"],
        product: {
            product_name: "新航道2023考研政治900题新航道2023考研政治900题新航道2023考研政治900题新航道2023考研政治900题新航道2023考研政治900题",
            detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题新航道考研政治2023年徐之明思想政治理论金榜书900题新航道考研政治2023年徐之明思想政治理论金榜书900题新航道考研政治2023年徐之明思想政治理论金榜书900题新航道考研政治2023年徐之明思想政治理论金榜书900题",
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
    const [listProducts, setListProduts] = useState(data);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<product[]>([]);
    const [top, setTop] = React.useState<number>(70);
    const [selectedAddress, setSelectedAddress] = useState<{ name: string; phone: string; address: string; } | null>(null);
    
    // 计算总价
    const calculateTotalCost = (selectedProducts: product[]) => {
        const total = selectedProducts.reduce((acc, item) => {
            return acc + (item.cost * item.itemNumber);
        }, 0);
        setTotalCost(total);
   };



    function onClickDelete(id: number) {

        const newListProduct = listProducts.filter(item => (item.id != id));
        setListProduts(newListProduct);

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
        setListProduts(newListProduct);

        
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

        setListProduts(newListProduct);
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
        setListProduts(newListProduct);
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

    const confirm = (x: product) => {
       onClickDelete(x.id)
    };

    const cancel = () => {
    };
    

    const addresses = [
        {
          name: '谢委屈华',
          phone: ' 18845678910',
          address: '上海交通大学闵行校区思源湖'
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
          {filteredAddresses.map((address, index) => (
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



    return (
        <>
            <Head>
                <title>预捐赠 - 上海交通大学绿色爱心屋</title>
            </Head>
            <Row>
                <Col  xs={24} sm={24} md={18}>
                    <div className={"container"}>
                        <Table
                            rowSelection={rowSelection}
                            dataSource={listProducts}
                        >
                            <Column
                                title={"图片"}
                                dataIndex={"image_url"}
                                width={"15%"}
                                align={"center"}
                                render={(urls: string[]) => (<Image src={urls[0]} preview={false} />)}
                            />
                            <Column
                                title={"商品"}
                                dataIndex={"product"}
                                ellipsis={true}
                                width={"35%"}
                                render={(product) => (
                                    <Space
                                        direction={"vertical"}
                                        style={{maxWidth: "100%"}}
                                    >
                                        <span style={{
                                            fontSize: "14px", fontWeight: "bold",
                                            overflow: "hidden", maxWidth: "100%"}}>

                                        </span>
                                        <Text
                                            strong={true}
                                            ellipsis={true}
                                        >
                                            {product.product_name}
                                        </Text>
                                        <Paragraph
                                            type={"secondary"}
                                            style={{
                                                fontSize: "12px", color: "gray",
                                                whiteSpace: "pre-wrap"
                                            }}
                                            ellipsis={{rows: 2, expandable: false}}
                                        >
                                            {product.detailed_product_name}
                                        </Paragraph>
                                    </Space>
                                )}
                            />
                            <Column
                                title={"单价"}
                                dataIndex={"cost"}
                                width={"10%"}
                                align={"center"}
                                render={(cost) => (
                                    <div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
                                        {/* <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{cost}</span> */}
                                        <AxCoin value={cost} coloredValue/>
                                    </div>
                                )}
                            />
                            <Column
                                title={"数量"}
                                dataIndex={"itemNumber"}
                                width={"20%"}
                                align={"center"}
                                ellipsis={true}
                                render={(_: any, x: product) => (
                                    <Space
                                        direction={"vertical"}
                                        style={{width: '100%', marginBottom:'-25px'}}
                                    >
                                        <Space.Compact style={{width: '72%'}}>
                                            <Button
                                                style={{width: '27%', padding: 0}}
                                                size={"small"}
                                                onClick={()=>onItemNumberMinus(x.id)}
                                                disabled={x.itemNumber <= 1}
                                            >
                                                -
                                            </Button>
                                            <InputNumber
                                                style={{width: '46%'}}
                                                size={"small"}
                                                min={1} max={x.stock} value={x.itemNumber}
                                                controls={false}
                                                onChange={value => {
                                                    if (value !== null) {
                                                        onItemNumberChange(x.id, value);
                                                    }
                                                }}  
                                            />
                                            <Button
                                                style={{width: '27%', padding: 0}}
                                                size={"small"}
                                                onClick={()=>onItemNumberPlus(x.id)}
                                                disabled={x.itemNumber >= x.stock}
                                            >
                                                +
                                            </Button>
                                        </Space.Compact>
                                        <Text style={{fontSize: '12px', color: "gray", display: 'flex', alignItems: "center", justifyContent: "center"}}>
                                            库存：{x.stock}
                                        </Text>
                                    </Space>
                                )}
                            />
                            <Column
                                title={"小计"}
                                align={"center"}
                                width={"10%"}
                                render={(_: any, x: product) => (
                                    <div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
                                        {/* <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{x.itemNumber * x.cost}</span> */}
                                        <AxCoin value={x.itemNumber * x.cost} coloredValue/>
                                    </div>
                                )}
                            />
                            <Column
                                title={"操作"}
                                align={"center"}
                                width={"10%"}
                                ellipsis={true}
                                render={(_: any, x: product) => (
                                    // <Button style={{padding: 0}} type={"link"} onClick={(()=>onClickDelete(x.id))}>删除</Button>
                                  <Popconfirm
                                    title="确认要删除商品吗？"
                                    // description="确认要删除商品吗？"
                                    onConfirm={() => confirm(x)}
                                    onCancel={() => cancel()}
                                    okText="确认删除"
                                    cancelText="取消"
                                  >
                                   <Button style={{padding: 0}} type={"link"} >删除</Button>
                                  </Popconfirm>
                                )}
                            />
                        </Table>
                    </div>
                    
                </Col>
                
                <Col xs={24} sm={24} md={6}>
                <Affix offsetTop={top}>
                {/* <Ordering selectedProducts={selectedProducts} /> */}
                <div className={"container"}>
                    <div> 
                        {/* 地址 */}
                                <Collapse defaultActiveKey={["1"]} style={{ marginBottom: "13px" }} ghost size="small">
                                    <Panel header="收货人信息：" key="1" style={{ maxHeight: "300px", textOverflow: "ellipsis", fontWeight: "bold" }}>
                                    <Dropdown overlay={menu} trigger={["click"]}>
                                        {/* 点击选择更多地址 */}
                                        
                                        <Button type="text" style={{ maxWidth: "23vmin", maxHeight: "300px", overflow: "auto", fontWeight: "lighter", height: "auto" }}>
                                        <Space>
                                            <Space direction="vertical" size="small" style={{ textAlign: "left" }}>
                                                <Space>
                                                    <span>{selectedAddress ? selectedAddress.name : "请选择地址"}</span>
                                                    <span>{selectedAddress ? selectedAddress.phone : ""}</span>
                                                </Space>
                                            <span style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis" }}>{selectedAddress ? selectedAddress.address : ""}</span>
                                            
                                            </Space>                                                                                 
                                                <EllipsisOutlined/>
                                        </Space>  
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
                </Affix>
                </Col>

            </Row>
        </>
    );
}

export default OrderPageView;