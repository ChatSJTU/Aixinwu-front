import React, { useEffect, useState } from "react";
import { Card, Image, Typography, Row, Col } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';

import { ProductSummary } from "@/models/products";
import { AxCoin } from "@/components/axcoin";

const { Title, Text } = Typography;

interface ProductSummaryProps {
    productSummary: ProductSummary;
}

export const ProductPreviewCard: React.FC<ProductSummaryProps> = ({ productSummary }) => {
    const { image_url, product_id, product_name, detailed_product_name, cost, stock } = productSummary;

    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
            style={{
                maxWidth: 200,
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                borderColor: hovered ? '#B3D4FC' : 'transparent',
                borderStyle: 'solid',
                borderWidth: '1px',
                position: 'relative',
                zIndex: hovered ? 1 : 'auto',
            }}
        >
            <a target="_blank" href={`/products/single/${product_id}`}>
                
            <Card
                hoverable
                style={{
                    maxWidth: 200,
                    transition: 'box-shadow 0.3s'
                }}
                cover={<Image alt={product_name} src={image_url[0]} preview={false} />}
            >
                <div style={{ padding: '10px' }}>
                    <Title level={5}>{product_name.length < 20 ? product_name : `${product_name.substring(0,20)}...`}</Title>
                    <Row justify="space-between" align="middle">
                        <Col style={{display:'flex', alignItems:'flex-start'}}>
                            <ShoppingCartOutlined size={14}/>
                            <Text>{`: ${stock}`}</Text>
                        </Col>
                        <Col style={{display:'flex'}}>
                            <AxCoin size={14}/>
                            <Text style={{ color: '#eb2f96' }}>{`: ${cost.toFixed(2)}`}</Text>
                        </Col>
                    </Row>
                    <div
                        style={{
                            maxHeight: hovered ? '100px' : '0',
                            overflow: 'hidden',
                            transition: 'max-height 0.3s ease',
                        }}
                    >
                        {detailed_product_name &&
                            <Text type="secondary">
                                {detailed_product_name.length < 30 ? detailed_product_name : `${detailed_product_name.substring(0, 30)}...`}
                            </Text>
                        }
                    </div>
                </div>
            </Card>
            </a>
        </div>
    );
}