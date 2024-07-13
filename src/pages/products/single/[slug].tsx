import { Image, Spin, Divider, Row, Col, Button, Typography, Carousel, Breadcrumb, Space, Flex, Tooltip, Grid, Radio, Modal } from 'antd'
import { ShoppingCartOutlined, InfoCircleFilled } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from "next/head";
import { useEffect, useState, useRef, useContext } from 'react';
import { AxCoin } from '@/components/axcoin';
import { ProductDetail, VarientDetail } from '@/models/products'
import MarkdownRenderer from '@/components/markdown-renderer';
import { getProductDetail } from '@/services/product';
import AuthContext from '@/contexts/auth';
import CartContext from '@/contexts/cart';
import { DirectBuyModal } from '@/components/direct-buy-modal';
import { MessageContext } from '@/contexts/message';

const { confirm } = Modal;
const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;


const ProductDetailsPage: React.FC = () => {
    const router = useRouter();
    const screens = useBreakpoint();
    const authCtx = useContext(AuthContext);
    const cartCtx = useContext(CartContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);
    
    const isMobile = !screens.lg;
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductDetail | undefined>(undefined);
    const [selectedVarient, setSelectedVarient] = useState<number>(0);

    const [isDirectBuyModalOpen, setDirectBuyModalOpen] = useState<boolean>(false);
    
    useEffect(() => {
        if (slug == undefined || slug == "")
            return;
        const fetchProductDetail = async () => {
            try {
                var resp = await getProductDetail(client!, process.env.NEXT_PUBLIC_CHANNEL!, slug as string);
                setProduct(resp);
                console.log(resp);
                setSelectedVarient(0);
            } catch (err) {
                console.error(err)
                //router.push('/404');
            }
        };
        fetchProductDetail();
    }, [slug, router]);

    const handleBuyClick = () => {
        if (selectedVarient == undefined)
        {
            message.error("操作失败：未选择商品分类或分类不存在。");
            return;
        }
        confirm({
            title: '下单确认',
            icon: <InfoCircleFilled />,
            content: (
                <Space size="small">
                    {'是否确认购买'}
                    {product?.varients[selectedVarient].sku ?? product?.name}
                </Space>
            ),
            onOk() {
                setDirectBuyModalOpen(true);
            },
            onCancel() {
            },
        });
    }

    const handleDirectBuyModalClose = () => {
        setDirectBuyModalOpen(false);
    }

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
                    { title: <Link href={`/products/${product.channel}`}>商品详情</Link> },
                    { title: <Link href={`/products/single/${slug}`}>{product.name}</Link> }
                ]}
            />
            <div className='container'>
                <Row>
                    <Col span={isMobile ? 24 : 9}>
                        <Carousel autoplay draggable style={{ textAlign: 'center' }}>
                            {/* Todo: images 可能为 null */}
                            {product.images?.map((url, index) => (
                                (product.images!.length > 1 && (
                                    <Tooltip title="拖拽以切换图片" key={index}>
                                        <Image
                                            src={url}
                                            alt={`图片预览 ${index + 1}`}
                                            width={468}
                                            height={468}
                                            preview={false}
                                        />
                                    </Tooltip>
                                )) || (
                                    <Image
                                        key={index}
                                        src={url}
                                        alt={`图片预览 ${index + 1}`}
                                        width={468}
                                        height={468}
                                        preview={false}
                                    />
                                )
                            ))}
                        </Carousel>
                    </Col>
                    {isMobile &&
                        <Divider />
                    }
                    <Col span={isMobile ? 24 : 15}
                        style={isMobile ? { textAlign: 'center' } : { paddingLeft: '150px' }}
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
                                product.varients.length > 1 && (
                                    <Radio.Group
                                        onChange={(e) => {
                                            setSelectedVarient(Number(e.target.value));
                                        }}
                                        optionType="button"
                                        value={selectedVarient}>
                                        {product.varients.map((x, index) => (
                                            <Radio.Button 
                                                key={x.id} 
                                                value={index} 
                                            >
                                                {x.name}
                                            </Radio.Button>
                                        ))}
                                    </Radio.Group>
                                )
                            }
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Text style={{ fontSize: '16px' }}>售价：&nbsp;</Text>
                                <AxCoin size={24} value={product?.varients[selectedVarient]?.price} coloredValue={true} />
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
                                style={isMobile ? { marginTop: '10px', width: 'auto' }
                                    : { marginTop: '50px', width: '400px' }}
                            >
                                <Button
                                    type='primary'
                                    icon={<ShoppingCartOutlined />}
                                    style={{ backgroundColor: '#eb2f96' }}
                                    onClick={() => { cartCtx.addLines(product?.varients[selectedVarient]!.id, 1) }}
                                                                    >
                                    添加到爱心篮
                                </Button>
                                <Button
                                    type='default'
                                    icon={<AxCoin size={14} />}
                                    style={{ borderColor: '#eb2f96' }}
                                    onClick={handleBuyClick}
                                    disabled={product?.varients[selectedVarient]?.stock <= 0}
                                >
                                    立即购买
                                </Button>
                            </Space>
                        </Space>
                    </Col>
                </Row>
                <Divider />
                <div className="container article-content">
                    <MarkdownRenderer content={product.desc} />
                </div>
            </div>
            <DirectBuyModal isopen={isDirectBuyModalOpen} varient={product?.varients[selectedVarient!]} product={product!} onClose={handleDirectBuyModalClose}/>
        </>
    );
};

export default ProductDetailsPage;