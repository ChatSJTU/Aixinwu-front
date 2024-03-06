import { Button, Form, Input, InputNumber, Row, Col, Space, Spin, Checkbox} from "antd";
import { ProductSummary, ProductSummaryExample } from "@/models/products";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import { Image, Divider, Typography, Carousel, Breadcrumb } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';
import {AxCoin} from "@/components/axcoin";
import type { CheckboxProps} from "antd";

const { Title, Text, Link } = Typography;


interface ProductSummaryCardProps {
    id: number;
}

export const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({id}) => {
    // 商品摘要信息，显示在购物车和订单中
    const router = useRouter();
    const [productSummary, setProductSummary] = useState<ProductSummary | null>(null);
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
                        product_id: 1,
                        detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题",
                        desc: "//此部分后续可更换为嵌入html代码，需注意DOM-based XSS\n\n商品名称：新航道2023考研政治900题\n出版社：世界知识出版社\n本书有以下特点：\n1.根据考试大纲、2021版新教材编写，考点覆盖，重点突出，讲解详实。\n2.中国人民大学教授、原考研政治命题专家主编。\n3.偶数页题目、奇数页答案对应编排，人性化设计方便考生刷题。",
                        cost: 24,
                        stock: 907
                    }
                }
                const productSummary = response.data;
                setProductSummary(productSummary);
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
        return <center><Spin tip="loading..." size="large" style={{ marginTop: '200px' }} /></center>; // 可以显示加载状态指示器
    }

    return (
        <Row>
            <Col>
                <div className="container" style={{
                    overflow: "hidden",
                    minHeight: 90,
                    height: 90,
                    width: 90,
                    padding: '0px',
                    alignItems: 'center'
                }}>
                    <Image
                        src={productSummary.image_url[0]}
                        width={90}
                        height={90}
                    />
                </div>
            </Col>
                <Col>
                    <Text style={{display: 'flex', alignItems: 'left', margin: '10px'}}>
                        {productSummary.product_name}
                    </Text>
                    <Text style={{display: 'flex', alignItems: 'left', margin: '10px'}}>
                        爱心币：<AxCoin size={16}/>
                        <span style={{color: '#eb2f96'}}>{productSummary.cost}</span>
                    </Text>
                    {productSummary.stock && (
                        <>
                            <Text style={{display: 'flex', alignItems: 'left', margin: '10px'}}>
                                {`库存: ${productSummary.stock}`}
                            </Text>
                        </>
                    )}
                </Col>
        </Row>
)
}

interface ProductListCardProps {
    id: number;
    num: number;
    cardType: string;
    checkbox?: boolean;
}

const onChange: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
};

export const ProductListCard: React.FC<ProductListCardProps> = ({cardType, id, num, checkbox}) => {
    // 商品列中的每一个元素
    // TODO@Hua
    return (
        <div className={"container"} style={{alignItems: "center"}}>
            <Row>
                {(cardType=='cart') &&
                    <Col>
                        <Checkbox
                            onChange={onChange}
                            style={{ // 绝对位置居中
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)"
                            }}
                            defaultChecked={checkbox}
                        />
                    </Col> }
                <Col span={10}>
                    <ProductSummaryCard id={id}/>
                </Col>
                <Col>
                    <InputNumber
                        style={{ // 绝对位置居中
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "150px"
                        }}
                        defaultValue={num}
                        addonBefore={"购买数量"}
                    />
                </Col>
            </Row>

        </div>
    )
}