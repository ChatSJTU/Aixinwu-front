import React, { useContext } from "react";
import { Card, Image, Typography, Space, Flex } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';
import ThemeContext from "@/contexts/theme";

import { ProductSummaryProps } from "@/models/products";
import { AxCoin } from "./axcoin";

const { Text } = Typography;

export const ProductPreviewCard: React.FC<ProductSummaryProps> = ({ productSummary }) => {
    const { image_url, product_id, product_slug, product_name, detailed_product_name, cost, stock } = productSummary;
    const themeCtx = useContext(ThemeContext);
    return (
        <div
            className="preview-card-container"
        >
            <a href={`/products/single/${product_slug}`}>
                <Card
                    hoverable
                    className="preview-card"
                    cover={<Image className='preview-card-cover' alt={product_name} src={image_url[0]} preview={false} />}
                >
                    <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                        <span className='preview-card-title'>{product_name}</span>
                        <Flex justify="space-between" align="center">
                            <div style={{whiteSpace: 'nowrap'}}>
                                <ShoppingCartOutlined />
                                <Text style={{marginLeft:'2px'}}>{stock}</Text>
                            </div>
                            <div style={{whiteSpace: 'nowrap'}}>
                                <AxCoin size={14}/>
                                <Text strong style={{marginLeft:'2px', color: themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882"}}>{cost >= 1000 ? cost.toFixed(1) : cost.toFixed(2)}</Text>
                            </div>
                        </Flex>
                        {detailed_product_name &&
                            <Text type="secondary" className="two-line-ellipsis">
                                {detailed_product_name!.length < 30 ? detailed_product_name : `${detailed_product_name!.substring(0, 30)}...`}
                            </Text>
                        }
                    </Space>
                </Card>
            </a>
        </div>
    );
}