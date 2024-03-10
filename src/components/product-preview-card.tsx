import React from "react";
import { Card, Image, Typography, Space, Flex } from 'antd'
import { ShoppingCartOutlined, PayCircleOutlined } from '@ant-design/icons';

import { ProductSummaryProps } from "@/models/products";

const { Title, Text } = Typography;

export const ProductPreviewCard: React.FC<ProductSummaryProps> = ({ productSummary }) => {
    const { image_url, product_id, product_name, detailed_product_name, cost, stock } = productSummary;

    return (
        <div
            className="preview-card-container"
        >
            <a target="_blank" href={`/products/single/${product_id}`}>
                <Card
                    hoverable
                    className="preview-card"
                    cover={<Image className='preview-card-cover' alt={product_name} src={image_url[0]} preview={false} />}
                >
                    <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                        <span className='preview-card-title'>{product_name}</span>
                        <Flex justify="space-between" align="center">
                            <div>
                                <ShoppingCartOutlined />
                                <Text style={{marginLeft:'3px'}}>{` ${stock}`}</Text>
                            </div>
                            <div>
                                <PayCircleOutlined/>
                                <Text strong style={{marginLeft:'4px'}}>{`${cost.toFixed(2)}`}</Text>
                            </div>
                        </Flex>
                        {detailed_product_name &&
                            <Text type="secondary" className="two-line-ellipsis">
                                {detailed_product_name.length < 30 ? detailed_product_name : `${detailed_product_name.substring(0, 30)}...`}
                            </Text>
                        }
                    </Space>
                </Card>
            </a>
        </div>
    );
}