import { Image, Spin, Divider, Row, Col, Button, Typography, Carousel, Breadcrumb, Space, Flex, Tooltip, Grid } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from "next/head";
import { useEffect, useState, useRef } from 'react';
import { AxCoin } from '@/components/axcoin';
import { ProductDetails } from '@/models/products'
import MarkdownRenderer from '@/components/markdown-renderer';

const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;


const ProductDetailsPage: React.FC = () => {
    const router = useRouter();
    const screens = useBreakpoint();
    const isMobile = !screens.lg;
    const { id } = router.query;
    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                // 根据id, 从后端获取response
                // 以下为一个示例
                const response = {
                    data: {
                        image_url: ["https://gw.alicdn.com/imgextra/i3/2208377286554/O1CN01J3AiUF1yHmXSkmX92_!!2208377286554.jpg_Q75.jpg_.webp",
                            "https://gw.alicdn.com/imgextra/O1CN01ByoP8w1CP1OEei4ub-101450072.jpg_Q75.jpg_.webp",
                            "https://gw.alicdn.com/imgextra/O1CN01JzdVG21CP1LaSAvZG-101450072.jpg_Q75.jpg_.webp"],
                        product_name: "新航道2023考研政治900题",
                        product_id: 122,
                        detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题",
                        desc: "商品名称：新航道2023考研政治900题\n出版社：世界知识出版社\n本书有以下特点：\n1.根据考试大纲、2021版新教材编写，考点覆盖，重点突出，讲解详实。\n2.中国人民大学教授、原考研政治命题专家主编。\n3.偶数页题目、奇数页答案对应编排，人性化设计方便考生刷题。",
                        cost: 24,
                        stock: 907
                    }
                }
                const productDetails = response.data;
                setProductDetails(productDetails);
                //setProductDetails(null);
            } catch (error) {
                router.push('/404');
            }
        };

        if (Number.isInteger(Number(id))) {
            fetchProductDetails();
        }
    }, [id, router]);

    if (!productDetails) {
        return <center><Spin size="large" style={{ marginTop: '200px' }} /></center>; // 可以显示加载状态指示器
    }

    return (
        <>
            <Head>
                <title>{`商品详情-${productDetails.product_name}`}</title>
            </Head>
            <Breadcrumb style={{ margin: "4px 12px 4px 12px" }}
                items={[
                    { title: <Link href="/">首页</Link> },
                    { title: <Link href="/products">商品详情</Link> },
                    { title: <Link href={`/products/single/${id}`}>{productDetails.product_name}</Link> }
                ]}
            />
            <div className='container'>
                <Row>
                    <Col span={isMobile ? 24 : 9}>
                        <Carousel autoplay draggable style={{ textAlign: 'center' }}>
                            {productDetails.image_url.map((url, index) => (
                                <div key={index}>
                                    <Tooltip title="拖拽以切换图片">
                                    <Image
                                        src={url}
                                        alt={`图片预览 ${index + 1}`}
                                        width={468}
                                        height={468}
                                        preview={false}
                                    />
                                    </Tooltip>
                                </div>
                            ))}
                        </Carousel>
                    </Col>
                    {isMobile &&
                        <Divider/>
                    }
                    <Col span={isMobile ? 24 : 15} style={isMobile ? {textAlign: 'center'} : { paddingLeft: '150px' }}>
                        <Space direction='vertical' size={'middle'}>
                            <Title level={2} style={{ marginTop: '0px' }}>{productDetails.product_name}</Title>
                            {productDetails.detailed_product_name && (
                                <Title level={4} style={{ marginTop: '0px' }} type="secondary">{productDetails.detailed_product_name}</Title>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Text style={{ fontSize: '16px'}}>爱心币&nbsp;</Text>
                                <AxCoin size={16}/>
                                <Text strong style={{ color: '#eb2f96', fontSize: '26px'}}>{productDetails.cost.toFixed(2)}</Text>
                            </div>
                            {productDetails.stock && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Text type='secondary'>{`库存: ${productDetails.stock}`}</Text>
                                </div>
                            )}
                            <Flex justify="space-between" align="center" style={isMobile ? {marginTop: '10px', width: 'auto'} : {marginTop: '50px', width: '400px'}}>
                                <Button
                                    type='primary'
                                    icon={<ShoppingCartOutlined />}
                                    style={{ backgroundColor: '#eb2f96' }}
                                    onClick={() => { }}
                                >
                                    添加到爱心篮
                                </Button>
                                <Button
                                    type='default'
                                    icon={<AxCoin size={14} />}
                                    style={{ borderColor: '#eb2f96' }}
                                    onClick={() => { }}
                                >
                                    立即购买
                                </Button>
                            </Flex>
                        </Space>
                    </Col>
                </Row>
                <Divider />
                <div className="container article-content">
                    <MarkdownRenderer content={productDetails.desc} />
                </div>
            </div>
        </>
    );
};

export default ProductDetailsPage;