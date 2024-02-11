import { Image, Spin, Divider, Row, Col, Button, Typography } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from "next/head";
import { useEffect, useState } from 'react';
import { AxCoin } from '@/components/axcoin';

const { Title, Text, Link } = Typography;

interface ProductDetails {
    image_url: string;
    product_name: string;
    detailed_product_name?: string;
    desc: string; // 后续可以传入html代码，这样商品描述格式就不单一了
    cost: number;
    stock?: number;
    upload_time?: string;
    [propName: string]: any;
}

const ProductDetailsPage: React.FC = () => {
    const router = useRouter();
    const { product_id } = router.query;
    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                // 根据product_id, 从后端获取response
                // 以下为一个示例
                const response = {
                    data: {
                        image_url: "https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg",
                        product_name: "新航道2023考研政治900题",
                        detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题",
                        desc: "//此部分后续可更换为嵌入html代码，需注意DOM-based XSS\n\n商品名称：新航道2023考研政治900题\n出版社：世界知识出版社\n本书有以下特点：\n1.根据考试大纲、2021版新教材编写，考点覆盖，重点突出，讲解详实。\n2.中国人民大学教授、原考研政治命题专家主编。\n3.偶数页题目、奇数页答案对应编排，人性化设计方便考生刷题。",
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

        if (product_id) {
            fetchProductDetails();
        }
    }, [product_id, router]);

    if (!productDetails) {
        return <center><Spin tip="loading..." size="large" style={{ marginTop: '200px' }} /></center>; // 可以显示加载状态指示器
    }

    return (
        <>
        <Head>
           <title>{`商品详情-${productDetails.product_name}`}</title>
        </Head>
        <div>
            <Row>
                <Col span={6}>
                    <div className='container'>
                        <Image
                            src={productDetails.image_url}
                            alt={productDetails.product_name}
                            width={168}
                            height={168}
                        />
                    </div>
                </Col>
                <Col span={18} style={{ paddingLeft: '250px' }}>
                    <div className='container'>
                        <Title level={4} style={{marginTop: '0px'}}>{productDetails.product_name}</Title>
                        {productDetails.detailed_product_name && (
                            <Title level={5} type="secondary">{productDetails.detailed_product_name}</Title>
                        )}
                        <Text style={{ display: 'flex', alignItems: 'center' }}>
                            爱心币：<AxCoin size={16} />
                            <span style={{ color: '#eb2f96' }}>{productDetails.cost}</span>
                        </Text>
                        {productDetails.stock && (
                            <>
                                <Text>{`库存: ${productDetails.stock}`}</Text>
                                <br></br>
                            </>
                        )}
                        <Button
                            type='primary'
                            icon={<ShoppingCartOutlined />}
                            style={{ backgroundColor: '#eb2f96', marginTop: '50px' }}
                            onClick={() => { }}
                        >
                            添加到爱心篮
                        </Button>
                    </div>
                </Col>
            </Row>
            <Divider />
            <div className='container'>
                <Text style={{ whiteSpace: 'pre-line' }} >{productDetails.desc}</Text>
            </div>
        </div>
        </>
    );
};

export default ProductDetailsPage;