import Head from "next/head";
import {Col, Row, List, Space, Input, Avatar, Skeleton, InputNumber, Typography, Image, Button} from "antd";
import OrderPage from "@/pages/old-order";
import {AxCoin} from "@/components/axcoin";
import React, {useState} from "react";
import {it} from "node:test";
import {tree} from "next/dist/build/templates/app-page";
import {runInNewContext} from "vm";
const { Title, Text, Link } = Typography;


function getProductSummary(id: number, itemNumber: number) {
    return ({
        id: id,
        itemNumber: itemNumber,
        image_url: ["https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6394/202203_347.jpg",
            "https://aixinwu.sjtu.edu.cn/uploads/product/6457/202306_347.jpg"],
        product_name: "新航道2023考研政治900题",
        detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题新航道考",
        desc: "//此部分后续可更换为嵌入html代码，需注意DOM-based XSS\n\n商品名称：新航道2023考研政治900题\n出版社：世界知识出版社\n本书有以下特点：\n1.根据考试大纲、2021版新教材编写，考点覆盖，重点突出，讲解详实。\n2.中国人民大学教授、原考研政治命题专家主编。\n3.偶数页题目、奇数页答案对应编排，人性化设计方便考生刷题。",
        cost: 24,
        stock: 907,

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
                                                    avatar={<Image src={item.image_url[0]} style={{maxWidth: "7vw"}}/>}
                                                    title={item.product_name}
                                                    description={item.detailed_product_name}
                                                />
                                            </Col>
                                            <Col span={2} style={{display:"flex"}}>
                                                <Button
                                                    style={{display: 'flex', alignItems: "center", marginLeft: "auto", marginRight:"auto", textHoverBg: "white"}}
                                                    type={"link"}
                                                >
                                                    <AxCoin size={16}/> <span style={{color: '#eb2f96'}}>{item.cost}</span>
                                                {/* 单价 */}
                                                </Button>
                                            </Col>
                                            <Col span={4}>
                                                <div style={{display: "flex", flexDirection: "column", alignItems:"center"}}>
                                                    <Space.Compact style={{width: '100%'}}>
                                                        <Button
                                                            style={{paddingLeft: '10%', paddingRight: '10%'}}
                                                            onClick={()=>onItemNumberMinus(item.id)}
                                                            disabled={item.itemNumber <= 1}
                                                        >
                                                            -
                                                        </Button>
                                                        <InputNumber
                                                            min={1} max={item.stock} value={item.itemNumber}
                                                            controls={false}
                                                            onChange={(value) => onItemNumberChange(item.id, value)}
                                                        />
                                                        <Button
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
                                                    style={{display: 'flex', alignItems: "center", marginLeft: "auto", marginRight:"auto", textHoverBg: "white"}}
                                                    type={"link"}
                                                >
                                                    <AxCoin size={16}/> <span style={{color: '#eb2f96'}}>{item.cost * item.itemNumber}</span>
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
                                            {/*<Col span={2} style={{display:"flex"}}>*/}
                                            {/*    <Button*/}
                                            {/*        style={{display: 'flex', alignItems: "center", marginLeft: "auto", marginRight:"auto"}}*/}
                                            {/*        type={"text"}*/}
                                            {/*    >*/}
                                            {/*        分享*/}
                                            {/*    </Button>*/}
                                            {/*</Col>*/}
                                        </Row>
                                    </List.Item>
                                </>
                            )}
                        />
                    </div>
                </Col>
                <Col span={6}>
                    <div className={"container"}>
                        这里会是一个小组件@yjh
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default OrderPageView;