import Head from "next/head";
import {Col, Row, List, Space, Input, Avatar, Skeleton, InputNumber, Typography, Image, Button, Table} from "antd";
const { Column } = Table;
import {AxCoin} from "@/components/axcoin";
import React, {useState} from "react";
import {Ordering} from "@/components/ordering";
const { Title, Text, Link, Paragraph } = Typography;



interface product {
    id: number,
    itemNumber: number,
    image_url: string[],
    pruduct : {
        product_name: string,
        detailed_product_name: string
    }
    cost: number
    stock: number
    subtotal: number
}


function getProductSummary(id: number, itemNumber: number) {
    return ({
        id: id,
        itemNumber: itemNumber,
        image_url: ["https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6394/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6457/202306_347.jpg"],
        product: {
            product_name: "新航道2023考研政治900题TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
            detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题新航道考治2023年徐之明思想政治理论金榜书900题新航道考治2023年徐之明思想政治理论金榜书900题新航道考治2023年徐之明思想政治理论金榜书900题新航道考AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        },
        cost: 24,
        stock: 907,
        subtotal: 0
    });
}

const OrderPageView = () => {
    var data = [
        getProductSummary(1, 1),
        getProductSummary(2, 4),
    ];
    const [listProducts, setListProduts] = useState(data);

    function onClickDelete(id: number) {
        const newListProduct = listProducts.filter(item => (item.id != id));
        setListProduts(newListProduct);
    }

    function onItemNumberChange(id: number, value: number) {
        const newListProduct = listProducts.map(
            (item) => {
                if (item.id == id) {
                    item.itemNumber = value;
                    return item;
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
    }

    return (
        <>
            <Head>
                <title>预捐赠 - 上海交通大学绿色爱心屋</title>
            </Head>
            <Row>
                <Col span={18}>
                    <div className={"container"}>
                        <Table
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
                                render={(_: any, x: product) => (
                                    <Space
                                        direction={"vertical"}
                                        style={{width: '100%'}}
                                    >
                                        <Space.Compact style={{width: '100%'}}>
                                            <Button
                                                style={{width: '20%', padding: 0}}
                                                size={"small"}
                                                // type={"ghost"}
                                                // style={{paddingLeft: '10%', paddingRight: '10%'}}
                                                onClick={()=>onItemNumberMinus(x.id)}
                                                disabled={x.itemNumber <= 1}
                                            >
                                                -
                                            </Button>
                                            <InputNumber
                                                style={{width: '60%'}}
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
                                                style={{width: '20%', padding: 0}}
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
                                render={(_: any, x: product) => (
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
                                render={(_: any, x: product) => (
                                    <Button style={{padding: 0}} type={"link"} onClick={(()=>onClickDelete(x.id))}>删除</Button>
                                )}
                            />
                        </Table>
                    </div>
                    <div className={"container"}>
                        <List
                            itemLayout="horizontal"
                            dataSource={listProducts}
                            size={"large"}
                            header = {
                                <div style={{padding: "0px 24px"}}>
                                    <Row style={{width: "100%", alignItems:"center", alignContent:"center", height: "50%"}} justify="space-between">
                                        <Col span={12}><center>商品</center></Col>
                                        <Col span={2}><center>单价</center></Col>
                                        <Col span={4}><center>数量</center></Col>
                                        <Col span={2}><center>小记</center></Col>
                                        <Col span={2}/>
                                    </Row>
                                </div>
                            }
                            renderItem={(item) =>(
                                <>
                                    <List.Item
                                    >
                                        <Row style={{width: "100vw", alignItems:"top", alignContent:"top"}} justify="space-between" align="top">
                                            <Col span={12} style={{display:"flex"}}>
                                                <List.Item.Meta
                                                    avatar={<Image src={item.image_url[0]} style={{maxWidth: "7vw"}} />}
                                                    title={item.product.product_name}
                                                    description={item.product.detailed_product_name}
                                                />
                                            </Col>
                                            <Col span={2} style={{display:"flex"}}>
                                                <Button
                                                    // style={{display: 'flex', alignItems: "center", marginLeft: "auto", marginRight:"auto", textHoverBg: "white"}}
                                                    style={{display: 'flex', alignItems: "center", marginLeft: "auto", marginRight:"auto"}}
                                                    type={"link"}
                                                >
                                                    <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{item.cost}</span>
                                                {/* 单价 */}
                                                </Button>
                                            </Col>
                                            <Col span={4}>
                                                <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
                                                    <Space.Compact style={{width: '100%'}}>
                                                        <Button
                                                            size={"small"}
                                                            style={{paddingLeft: '10%', paddingRight: '10%'}}
                                                            onClick={()=>onItemNumberMinus(item.id)}
                                                            disabled={item.itemNumber <= 1}
                                                        >
                                                            -
                                                        </Button>
                                                        <InputNumber
                                                            size={"small"}
                                                            min={1} max={item.stock} value={item.itemNumber}
                                                            controls={false}
                                                            onChange={value => {
                                                                if (value !== null) {
                                                                    onItemNumberChange(item.id, value);
                                                                }
                                                            }}
                                                        />
                                                        <Button
                                                            size={"small"}
                                                            style={{paddingLeft: '10%', paddingRight: '10%'}}
                                                            onClick={()=>onItemNumberPlus(item.id)}
                                                            disabled={item.itemNumber >= item.stock}
                                                        >
                                                            +
                                                        </Button>
                                                    </Space.Compact>
                                                    {/*<InputNumber*/}
                                                    {/*    min={1} max={item.stock} defaultValue={item.itemNumber}*/}
                                                    {/*    key={"itemNumber"} style={{width: '100%'}} changeOnWheel={true} controls={false}*/}
                                                    {/*    addonBefore={*/}
                                                    {/*        <Button*/}
                                                    {/*            type={"text"}*/}
                                                    {/*            style={{padding:"2vh", alignContent:"center"}}*/}
                                                    {/*        >-</Button>*/}
                                                    {/*    }*/}
                                                    {/*    addonAfter={<div onClick={() => {alert("+")}}>+</div>}*/}

                                                    {/*/>*/}
                                                    <Text style={{fontSize: '12px', color: "gray", display: 'flex', alignItems: "center"}}>
                                                        库存：{item.stock}
                                                    </Text>
                                                </div>
                                            </Col>
                                            <Col span={2} style={{display:"flex"}}>
                                                <Button
                                                    // style={{display: 'flex', alignItems: "center", marginLeft: "auto", marginRight:"auto", textHoverBg: "white"}}
                                                    style={{display: 'flex', alignItems: "center", marginLeft: "auto", marginRight:"auto"}}
                                                    type={"link"}
                                                >
                                                    <AxCoin size={2}/> <span style={{color: '#eb2f96'}}>{item.cost * item.itemNumber}</span>
                                                {/* 小记 */}
                                                </Button>
                                            </Col>
                                            <Col span={2} style={{display:"flex", flexDirection: "column", alignItems:"center"}}>
                                                <Button
                                                    style={{display: 'flex', alignItems: "center", marginLeft: "auto", marginRight:"auto"}}
                                                    type={"text"}
                                                    onClick={(()=>onClickDelete(item.id))}
                                                >
                                                    删除
                                                </Button>
                                            </Col>
                                        </Row>
                                    </List.Item>
                                </>
                            )}
                        />
                    </div>
                </Col>
                
                <Col span={6}>
                  <Ordering />
                </Col>

            </Row>
        </>
    );
}

export default OrderPageView;