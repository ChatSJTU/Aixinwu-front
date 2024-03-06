import { Button, Form, Input, InputNumber, Row, Col, Space, Spin, Checkbox} from "antd";
import { ProductSummary, ProductSummaryExample } from "@/models/products";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import { Image, Divider, Typography, Carousel, Breadcrumb } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';
import {AxCoin} from "@/components/axcoin";
import type { CheckboxProps} from "antd";
import { ProductCardInfo } from "@/components/product-list-card"
import { ProductListCard } from "@/components/product-list-card";

const { Title, Text, Link } = Typography;


export interface ProductListProps {
    pageIs: string; // "cart" or "order"
    productInfoList: ProductCardInfo[];
}


export const ProductList: React.FC<ProductListProps> = ({pageIs, productInfoList}) => {

    const listItems = productInfoList.map((Info) =>
        <div><ProductListCard pageIs={pageIs} productCardInfo={Info}/></div>
    );

    return (
        <>
            <div
                className={"container"}
                style={{
                    minHeight: 42,
                    maxHeight: 42,
                    paddingTop: 0,
                }}
            >
                <Row type="flex" justify="space-between" align="middle">
                    {(pageIs=='cart') &&
                        <Col span={1}>
                            <Checkbox
                                onChange={() => {/* TODO@Hua */}}
                                align="center"
                                defaultChecked={false}
                            />
                        </Col> }
                    <Col span={2}>
                        全选</Col>
                    <Col span={10}>
                        <Text style={{display: 'flex', alignItems: 'left', alignContent: 'center', margin: '10px'}}>
                            商品
                        </Text>
                    </Col>
                    <Col span={2}>
                        <Text style={{display: 'flex', alignItems: 'left', alignContent: 'center', margin: '10px'}}>
                            单价
                        </Text>
                    </Col>
                    <Col span={2}>
                        <Text style={{display: 'flex', alignItems: 'left', alignContent: 'center', margin: '10px'}}>
                            库存
                        </Text>
                    </Col>
                    <Col span={2}>
                        <Text style={{display: 'flex', alignItems: 'left', alignContent: 'center', margin: '10px'}}>
                            购买数量
                        </Text>
                    </Col>
                    <Col span={2}>
                        <Text style={{display: 'flex', alignItems: 'left', alignContent: 'center', margin: '10px'}}>
                            小记
                        </Text>
                    </Col>
                    <Col span={2}></Col>
                </Row>
            </div>
            <div>
                {listItems}
            </div>
        </>
    );
}