import Head from "next/head";
import {Col, Row, List, Space, Input, Avatar, Skeleton, InputNumber, Typography, Image, Button, Table, Grid} from "antd";
const { Column } = Table;
import {AxCoin} from "@/components/axcoin";
import React, {useEffect, useState} from "react";
import {OrderPanel} from "@/components/order-panel";
import {OrderProductList} from "@/components/product-list"
const { Title, Text, Link, Paragraph } = Typography;
import type {OrderProduct} from "@/models/order";
const { useBreakpoint } = Grid;


function getProductSummary(key:number, id: number, itemNumber: number): OrderProduct {
    return ({
        key: key,
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
        getProductSummary(1, 1, 1),
        getProductSummary(2, 4, 2),
    ];
    const [listProducts , setListProduts] = useState(data);
    const [totalCost, setTotalCost] = useState(0)

     const calculateTotalCost = () => {
         const total = listProducts.reduce((acc, item) => {
             return acc + (item.cost * item.itemNumber);
         }, 0);
         setTotalCost(total);
     };

    function onClickDelete(id: number) {
        const newListProduct = listProducts.filter(item => (item.id != id));
        setListProduts(newListProduct);
        calculateTotalCost();
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
        calculateTotalCost();
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
        calculateTotalCost();
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
        calculateTotalCost();
    }

    const [screenSize, setScreenSize] = useState('lg'); // 默认为大屏幕
    useEffect(() => {
        const handleResize = () => {
            // if (window.innerWidth < 768) {
            //     setScreenSize('xs');
            // } else
            if (window.innerWidth < 992) {
                setScreenSize('sm');
            } else if (window.innerWidth < 1200) {
                setScreenSize('md');
            } else {
                setScreenSize('lg');
            }
        };

        // 初始化时调用一次，以设置初始屏幕大小
        handleResize();

        // 监听窗口大小变化
        window.addEventListener('resize', handleResize);

        // 清除事件监听器
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {calculateTotalCost()});
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
                    />
                </Col>
                
                <Col xs={24} sm={24} md={6}>
                  <OrderPanel totalCost={totalCost}/>
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
                <Row>
                    <Col xs={24} sm={24} md={6}>
                      <OrderPanel totalCost={totalCost}/>
                    </Col>
                    <Col xs={24} sm={24} md={18}>
                        <OrderProductList
                            OrderListProducts={listProducts}
                            onClickDelete={onClickDelete}
                            onItemNumberChange={onItemNumberChange}
                            onItemNumberMinus={onItemNumberMinus}
                            onItemNumberPlus={onItemNumberPlus}
                        />
                    </Col>
                </Row>
                
            </>
        );
        
    }
}

export default OrderPageView;