import { Image, Spin, Divider, Row, Col, Button, Typography, Carousel, Breadcrumb, Space, Flex, Tooltip, Grid, Radio } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from "next/head";
import { useEffect, useState, useRef, useContext } from 'react';
import { AxCoin } from '@/components/axcoin';
import { ProductDetail, VarientDetail } from '@/models/products'
import MarkdownRenderer from '@/components/markdown-renderer';
import { getProductDetail } from '@/services/product';
import AuthContext from '@/contexts/auth';
import CartContext from '@/contexts/cart';

const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;


const ProductDetailsPage: React.FC = () => {
    const router = useRouter();
    const screens = useBreakpoint();
    const authCtx = useContext(AuthContext);
    const cartCtx = useContext(CartContext);
    const client = authCtx.client;
    const isMobile = !screens.lg;
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductDetail | undefined>(undefined);
    const [varient, setVarient] = useState<VarientDetail | undefined>(undefined);

    useEffect(() => {
        if (slug == undefined || slug == "")
            return;
        const fetchProductDetail = async () => {
            try {
                var resp = await getProductDetail(client!, process.env.NEXT_PUBLIC_CHANNEL!, slug as string);
                setProduct(resp);
                setVarient(resp.varients[0]);
            } catch (err) {
                console.error(err)
                //router.push('/404');
            }
        };
        fetchProductDetail();
    }, [slug, router]);

    if (!product) {
        return (
            <center>
                <Spin size="large" style={{ marginTop: '200px' }} />
            </center>
        ); // 可以显示加载状态指示器
    }

    return (
        <>
            <Head>
                <title>{`商品详情 - ${product.name}`}</title>
            </Head>
            <Breadcrumb style={{ margin: "4px 12px 4px 12px" }}
                items={[
                    { title: <Link href="/">首页</Link> },
                    { title: <Link href="/products">商品详情</Link> },
                    { title: <Link href={`/products/single/${slug}`}>{product.name}</Link> }
                ]}
            />
            <div className='container'>
                <Row>
                    <Col span={isMobile ? 24 : 9}>
                        <Carousel autoplay draggable style={{ textAlign: 'center' }}>
                            {/* Todo: images 可能为 null */}
                            {product.images?.map((url, index) => (
                                <Tooltip title="拖拽以切换图片" key={index}>
                                    <Image
                                        src={url}
                                        alt={`图片预览 ${index + 1}`}
                                        width={468}
                                        height={468}
                                        preview={false}
                                    />
                                </Tooltip>
                            ))}
                        </Carousel>
                    </Col>
                    {isMobile &&
                        <Divider/>
                    }
                    <Col span={isMobile ? 24 : 15} 
                        style={isMobile ? {textAlign: 'center'} : { paddingLeft: '150px' }}
                    >
                        <Space direction='vertical' size={'middle'}>
                            <Title level={2} 
                                style={{ marginTop: '0px' }}>
                                {product.name}
                            </Title>
                            {
                                product.detailed_product_name && (
                                    <Title level={4} 
                                        style={{ marginTop: '0px' }} 
                                        type="secondary">
                                        {product.detailed_product_name}
                                    </Title>
                                )
                            }
                            {
                                product.varients.length > 1 &&(
                                    <Radio.Group 
                                        onChange={(e)=>{
                                            setVarient(product.varients.find(x=>x.id == e.target.value));
                                        }} 
                                        optionType="button">
                                        {product.varients.map(x=>(
                                            <Radio.Button value={x.id}>{x.name}</Radio.Button>
                                        ))}
                                    </Radio.Group>
                                )
                            }
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Text style={{ fontSize: '16px'}}>售价：&nbsp;</Text>
                                <AxCoin size={24} value={varient?.price} coloredValue={true}/>
                            </div>
                            {
                                varient?.stock && (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Text type='secondary'>{`库存: ${varient?.stock}`}</Text>
                                    </div>
                                )
                            }
                            <Flex justify="space-between" 
                                align="center" 
                                style={isMobile ? {marginTop: '10px', width: 'auto'} 
                                        : {marginTop: '50px', width: '400px'}}
                            >
                                <Button
                                    type='primary'
                                    icon={<ShoppingCartOutlined />}
                                    style={{ backgroundColor: '#eb2f96' }}
                                    onClick={() => {cartCtx.addLines(varient!.id, 1) }}
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
                    <MarkdownRenderer content={product.desc} />
                </div>
            </div>
        </>
    );
};

export default ProductDetailsPage;