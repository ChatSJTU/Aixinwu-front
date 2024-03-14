import {
    Col,
    Row,
    List,
    Divider,
    InputNumber,
    Typography,
    Image,
    Button,
    Input,
    Collapse,
    Menu,
    Dropdown,
    Space,
    Table,
} from 'antd';
const { Column } = Table;
const { Paragraph } = Typography;
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import {AxCoin} from "@/components/axcoin";
import React from "react";
import { useState } from 'react';
import { useEffect } from 'react';
import {ProductSummary} from "@/models/products";
const { Title, Text, Link } = Typography;
const { Panel } = Collapse;
import type {OrderListProductsProps, OrderProduct} from "@/models/order";


export const OrderProductList: React.FC<OrderListProductsProps> = (
    {
        OrderListProducts,
        onClickDelete,
        onItemNumberChange,
        onItemNumberMinus,
        onItemNumberPlus
    }
) => {
    // 确认订单界面，左边的一列商品信息：图、标题、单价、购买数量、小记、删除
    return (

        <div className={"container"}>
            <Table
                dataSource={OrderListProducts}
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
                            <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{cost}</span>
                        </div>
                    )}
                />
                <Column
                    title={"数量"}
                    dataIndex={"itemNumber"}
                    width={"20%"}
                    align={"center"}
                    ellipsis={true}
                    render={(_: any, x: OrderProduct) => (
                        <Space
                            direction={"vertical"}
                            style={{width: '100%'}}
                            align={'center'}
                        >
                            <Space.Compact style={{width: '60%'}}>
                                <Button
                                    style={{width: '25%', padding: 0}}
                                    size={"small"}
                                    // type={"ghost"}
                                    // style={{paddingLeft: '10%', paddingRight: '10%'}}
                                    onClick={()=>onItemNumberMinus(x.id)}
                                    disabled={x.itemNumber <= 1}
                                >
                                    -
                                </Button>
                                <InputNumber
                                    style={{width: '50%'}}
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
                                    style={{width: '25%', padding: 0}}
                                    size={"small"}
                                    // type={"ghost"}
                                    // style={{paddingLeft: '10%', paddingRight: '10%'}}
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
                    render={(_: any, x: OrderProduct) => (
                        <div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
                            <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{x.itemNumber * x.cost}</span>
                        </div>
                    )}
                />
                <Column
                    title={"    "}
                    align={"center"}
                    width={"10%"}
                    ellipsis={true}
                    render={(_: any, x: OrderProduct) => (
                        <Button style={{padding: 0}} type={"link"} onClick={(()=>onClickDelete(x.id))}>删除</Button>
                    )}
                />
            </Table>
        </div>
    )
}