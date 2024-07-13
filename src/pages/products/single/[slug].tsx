import { Image, Spin, Divider, Row, Col, Button, Typography, Carousel, Breadcrumb, Space, Flex, Tooltip, Grid, Radio, Modal, ConfigProvider } from 'antd'
import { ShoppingCartOutlined, InfoCircleFilled } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from "next/head";
import { useEffect, useState, useRef, useContext } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { AxCoin } from '@/components/axcoin';
import { ProductDetail, VarientDetail } from '@/models/products'
import MarkdownRenderer from '@/components/markdown-renderer';
import { getProductDetail } from '@/services/product';
import AuthContext from '@/contexts/auth';
import CartContext from '@/contexts/cart';
import { DirectBuyModal } from '@/components/direct-buy-modal';
import { MessageContext } from '@/contexts/message';
import ThemeContext from "@/contexts/theme";

const { confirm } = Modal;
const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;


const ProductDetailsPage: React.FC = () => {
    const router = useRouter();
    const screens = useBreakpoint();
    const authCtx = useContext(AuthContext);
    const cartCtx = useContext(CartContext);
    const themeCtx = useContext(ThemeContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);
    
    const isMobile = !screens.lg;
    const { slug } = router.query;
    const [product, setProduct] = useState<ProductDetail | undefined>(undefined);
    const [selectedVarient, setSelectedVarient] = useState<number>(-Infinity);

    const [isDirectBuyModalOpen, setDirectBuyModalOpen] = useState<boolean>(false);
    
    useEffect(() => {
        if (slug == undefined || slug == "")
            return;
        const fetchProductDetail = async () => {
            try {
                var resp = await getProductDetail(client!, process.env.NEXT_PUBLIC_CHANNEL!, slug as string);
                setProduct(resp);
                if (resp.varients.length === 1)
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

    const getHoverColor = (color: string) =>
        new TinyColor(color).lighten(15).toString();
      const getActiveColor = (color: string) =>
        new TinyColor(color).darken(15).toString();

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
                            <Title level={3}
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
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                { selectedVarient >= 0 
                                    ? <AxCoin size={24} value={product?.varients[selectedVarient]?.price} coloredValue={true} />
                                    : (product?.price.min === product?.price.max)
                                        ? <AxCoin size={24} value={product?.price.min} coloredValue={true} />
                                        : <AxCoin size={24} value={product?.price.min} maxValue={product?.price.max} shownRange={true} coloredValue={true} />
                                }
                            </div>  
                            {
                                product.varients.length > 1 && (
                                    <Space wrap>
                                        {product.varients.map((x, index) => (
                                            <Radio.Group
                                                key={x.id}
                                                onChange={(e) => {
                                                    setSelectedVarient(Number(e.target.value));
                                                }}
                                                value={selectedVarient}
                                                optionType="button"
                                            >
                                                <Radio.Button value={index}>
                                                    {x.name}
                                                </Radio.Button>
                                            </Radio.Group>
                                        ))}
                                    </Space>
                                    )
                            }
                            {selectedVarient >= 0 && <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Text type='secondary'>{`库存: ${product?.varients[selectedVarient]?.stock}`}</Text>
                            </div>}
                            <Space size="middle">
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            Button: {
                                                colorPrimary: themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882",
                                                colorPrimaryHover: getHoverColor(themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882"),
                                                colorPrimaryActive: getActiveColor(themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882"),
                                                lineWidth: 0,
                                            },
                                        },
                                    }}
                                    >
                                    <Button
                                        size="large"
                                        type='primary'
                                        // style={{ backgroundColor: themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882" }}
                                        onClick={handleBuyClick}
                                        disabled={selectedVarient < 0 || product?.varients[selectedVarient]?.stock <= 0}
                                    >
                                        立即购买
                                    </Button>
                                </ConfigProvider>
                                <Button
                                    size="large"
                                    type='default'
                                    icon={<ShoppingCartOutlined />}
                                    style={{ borderColor: themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882" }}
                                    onClick={() => { cartCtx.addLines(product?.varients[selectedVarient]!.id, 1) }}
                                >
                                    添加到爱心篮
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