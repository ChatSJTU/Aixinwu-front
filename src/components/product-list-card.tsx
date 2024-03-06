import { Button, Form, Input, InputNumber, Row, Col, Space, Spin, Checkbox} from "antd";
import { ProductSummary, ProductSummaryExample } from "@/models/products";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import { Image, Divider, Typography, Carousel, Breadcrumb } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';
import {AxCoin} from "@/components/axcoin";
import type { CheckboxProps} from "antd";
import {func} from "prop-types";

const { Title, Text, Link } = Typography;

export interface ProductCardInfo{
    id: number;
    itemNumber: number;
    checkbox?: boolean;
}


interface ProductListCardProps {
    pageIs: string; // "cart" or "order"
    productCardInfo: ProductCardInfo;
}

export const ProductListCard: React.FC<ProductListCardProps> = ({pageIs, productCardInfo: {id, itemNumber, checkbox}}) => {
    // 商品列中的每一个元素
    const router = useRouter();
    const [productSummary, setProductSummary] = useState<ProductSummary | null>(null);
    const [itemExpense, setItemExpense] = useState(itemNumber)
    const [MouseOverFlag, setMouseOverFlag] = useState(false);

    useEffect(() => {
        const fetchProductSummary = async () => {
            try {
                // 根据id, 从后端获取response
                // 以下为一个示例
                const response = {
                    data: {
                        image_url: ["https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg",
                            "https://aixinwu.sjtu.edu.cn/uploads/product/6394/202203_347.jpg",
                            "https://aixinwu.sjtu.edu.cn/uploads/product/6457/202306_347.jpg"],
                        product_name: "新航道2023考研政治900题",
                        detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题新航道考",
                        desc: "//此部分后续可更换为嵌入html代码，需注意DOM-based XSS\n\n商品名称：新航道2023考研政治900题\n出版社：世界知识出版社\n本书有以下特点：\n1.根据考试大纲、2021版新教材编写，考点覆盖，重点突出，讲解详实。\n2.中国人民大学教授、原考研政治命题专家主编。\n3.偶数页题目、奇数页答案对应编排，人性化设计方便考生刷题。",
                        cost: 24,
                        stock: 907
                    }
                }
                const productSummary = response.data;
                setProductSummary(productSummary);
                setItemExpense(itemNumber * productSummary.cost);
                //setProductSummary(null);
            } catch (error) {
                router.push('/404');
            }
        };

        if (Number.isInteger(Number(id))) {
            fetchProductSummary();
        }
    }, [id, router]);

    if (!productSummary) {
        return <div className={"container"} style={{alignItems: "center"}}><center><Spin tip="loading..." size="large" style={{ marginTop: '200px' }} /></center></div>; // 可以显示加载状态指示器
    }

    function onChangeItemNumber(value) {
        console.log('changed', value);
        itemNumber = value;
        setItemExpense(value * productSummary.cost);
    }

    function onClickDelete(e) {
        // TODO@Hua
        console.log('delete');
    }

    return (
        <div className={"container"} style={{alignItems: "center"}}>
            <Row type="flex" justify="space-between" align="middle">
                {(pageIs=='cart') &&
                    <Col span={1}>
                        <Checkbox
                            onChange={() => {/* TODO@Hua */}}
                            align="center"
                            defaultChecked={checkbox}
                        />
                    </Col> }
                <Col span={2}>
                    <div className="container" style={{
                        overflow: "hidden",
                        minHeight: 100,
                        height: 100,
                        width: 100,
                        padding: '0px',
                        alignItems: 'center',
                        margin: 0
                    }}>
                        <Image
                            src={productSummary.image_url[0]}
                            width={100}
                            height={100}
                        />
                    </div>
                </Col>
                <Col
                    span={10}
                    style={{
                        // position: "absolute",
                        // left: "20%",
                        // top: "60%",
                        // transform: "translate(40%, -50%)",
                        // width: "130px"
                        margin: 0
                    }}
                >
                    {/*<Text style={{display: 'flex', alignItems: 'left', alignContent: 'center', margin: '10px'}}>*/}
                    {/*    {productSummary.product_name}*/}
                    {/*</Text>*/}
                    <Row>
                        <Text style={{ overflow: 'hidden',textOverflow: 'ellipsis', maxHeight: '40px', marginBottom: '10px'}}>
                            {productSummary.product_name}
                        </Text>
                    </Row>
                    <Row>
                        <Text style={{ fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: '60px', marginBottom: '0px' }}>
                            {productSummary.detailed_product_name}
                        </Text>
                    </Row>
                </Col>
                <Col span={2}>
                    <Text style={{display: 'flex', alignItems: 'center', margin: '10px'}}>
                        <AxCoin size={16}/> <span style={{color: '#eb2f96'}}>{productSummary.cost}</span>
                    </Text>
                </Col>
                <Col span={2}>
                    <Text style={{display: 'flex', alignItems: 'left', margin: '10px'}}>
                        {`库存: ${productSummary.stock}`}
                    </Text>
                </Col>
                <Col span={2}>
                    <InputNumber
                        style={{display: 'flex', alignItems: 'left', margin: '10px'}}
                        defaultValue={itemNumber} min={1} max={productSummary.stock}
                        onChange={onChangeItemNumber}
                    />
                </Col>
                <Col span={2}>
                    <Text style={{display: 'flex', alignItems: 'center', margin: '10px'}}>
                        <AxCoin size={16}/> <span style={{color: '#eb2f96'}}>{itemExpense}</span>
                    </Text>
                </Col>
                <Col span={2}>
                    <Text
                        style={{display: 'flex', alignItems: 'center', margin: '10px', color: MouseOverFlag ? 'blue':''}}
                        onClick={onClickDelete}
                        onMouseEnter={() => {setMouseOverFlag(true);}}
                        onMouseLeave={() => {setMouseOverFlag(false);}}
                    >
                        删除
                    </Text>
                </Col>
            </Row>
        </div>
    )
}