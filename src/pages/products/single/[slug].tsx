import {
  Image, Spin, Divider, Row, Col, Button,
  Typography, Carousel, Breadcrumb, Space, InputNumber,
  Grid, Radio, ConfigProvider, Alert, Statistic
} from 'antd'
import {
  ShoppingCartOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  PayCircleOutlined
} from '@ant-design/icons';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import Head from "next/head";
import { useEffect, useState, useContext } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { AxCoin } from '@/components/axcoin';
import { ProductDetail } from '@/models/products'
import { getProductDetail } from '@/services/product';
import AuthContext from '@/contexts/auth';
import CartContext from '@/contexts/cart';
import { DirectBuyModal } from '@/components/direct-buy-modal';
import { MessageContext } from '@/contexts/message';
import ThemeContext from "@/contexts/theme";
import { DirectBuyConfirmModal } from '@/components/direct-buy-confirm-modal';

const { Countdown } = Statistic;
const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;
const QuillRenderer = dynamic(
  () => import("@/components/quill-renderer").then(mod => mod.default),
  { ssr: false }
);

interface ImageActions {
  onFlipY: () => void;
  onFlipX: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
}

const ProductDetailsPage: React.FC = () => {
  const router = useRouter();
  const screens = useBreakpoint();
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const themeCtx = useContext(ThemeContext);
  const client = authCtx.client;
  const message = useContext(MessageContext);

  const isMobile = !screens.md;
  const { slug, shared } = router.query;
  const [product, setProduct] = useState<ProductDetail | undefined>(undefined);
  const [timeLeftMillis, setTimeleftMillis] = useState<number>(-1);

  const [selectedVarient, setSelectedVarient] = useState<number>(-Infinity);
  const [queryQuantity, setQueryQuantity] = useState<number>(1);

  const [isDirectBuyConfirmModalOpen, setDirectBuyConfirmModalOpen] = useState<boolean>(false);
  const [isDirectBuyModalOpen, setDirectBuyModalOpen] = useState<boolean>(false);
  const [checkoutId, setCheckoutId] = useState<string | undefined>(undefined);

  const overQuantity = (
    (product?.varients[selectedVarient]?.quantityLimit != undefined && queryQuantity > product?.varients[selectedVarient]?.quantityLimit!)
    || queryQuantity > product?.varients[selectedVarient]?.stock!
  );

  const previewProps = {
    toolbarRender: (
      _: any,
      { transform: { scale }, actions }: { transform: { scale: number }; actions: ImageActions },
    ) => (
      <Space size={20} className="toolbar-wrapper">
        <SwapOutlined rotate={90} onClick={actions.onFlipY} />
        <SwapOutlined onClick={actions.onFlipX} />
        <RotateLeftOutlined onClick={actions.onRotateLeft} />
        <RotateRightOutlined onClick={actions.onRotateRight} />
        <ZoomOutOutlined disabled={scale === 1} onClick={actions.onZoomOut} />
        <ZoomInOutlined disabled={scale === 50} onClick={actions.onZoomIn} />
      </Space>
    ),
  };

  const channel = shared == "true" ? process.env.NEXT_PUBLIC_CHANNEL2 : process.env.NEXT_PUBLIC_CHANNEL;

  useEffect(() => {
    if (slug == undefined || slug == "")
      return;
    const fetchProductDetail = async () => {
      try {
        var resp = await getProductDetail(client!, channel!, slug as string);
        setProduct(resp);
        if (resp.availableForPurchaseAt) {
          setTimeleftMillis(new Date(resp.availableForPurchaseAt).getTime())
        }
        console.log(timeLeftMillis)
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
    if (selectedVarient == undefined) {
      message.error("操作失败：未选择商品分类或分类不存在。");
      return;
    }
    setDirectBuyConfirmModalOpen(true);
  }

  const handleDirectBuyConfirmModalCancel = () => {
    setDirectBuyConfirmModalOpen(false);
  }

  const handleDirectBuyConfirmModalOk = (checkoutId: string) => {
    setDirectBuyConfirmModalOpen(false);
    setCheckoutId(checkoutId);
    setDirectBuyModalOpen(true);
  }

  if (!product) {
    return (
      <center>
        <Spin size="large" style={{ marginTop: '200px' }} />
      </center>
    );
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
            <div style={{ maxHeight: '458px', maxWidth: '458px', overflow: 'hidden' }}>
              <Carousel autoplay autoplaySpeed={5000} speed={1500} draggable={isMobile} style={{ textAlign: 'center' }}>
                {product.images?.map((url, index) => (
                  <div key={index} className="image-container">
                    <Image
                      key={index}
                      src={url}
                      alt={`图片预览 ${index + 1}`}
                      preview={previewProps}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </Col>
          {isMobile &&
            <Divider />
          }
          <Col span={isMobile ? 24 : 15}
            style={isMobile ? { justifyContent: 'center' } : { paddingLeft: '150px', paddingRight: '60px' }}
          >
            <Space direction='vertical' size={'large'} style={{ width: '100%' }}>
              <Title level={3}
                style={{ marginTop: '0px', marginBottom: '-4px' }}>
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
              <div className='price-container'>
                {/* May place other components later */}
                <br />
                <div className='price-container-inner'>
                  {selectedVarient >= 0
                    ? <AxCoin size={24} value={product?.varients[selectedVarient]?.price} coloredValue={true} />
                    : (product?.price.min === product?.price.max)
                      ? <AxCoin size={24} value={product?.price.min} coloredValue={true} />
                      : <AxCoin size={24} value={product?.price.min} maxValue={product?.price.max} shownRange={true} coloredValue={true} />
                  }
                  {selectedVarient >= 0 &&
                    <Text type='secondary'>{`已售出 ${product.varients[selectedVarient].sold} 件`}</Text>
                  }
                </div>
              </div>
              {
                product.varients.length > 1 && (
                  <Space wrap>
                    <Text type='secondary'>分类：</Text>
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
              {selectedVarient >= 0 && <Space style={{ alignItems: 'center', width: '100%' }}>
                <Text type='secondary'>数量：</Text>
                <Space.Compact style={{ width: 'auto' }}>
                  <Button
                    style={{ width: '30px', padding: 0 }}
                    onClick={() => { queryQuantity > 1 && setQueryQuantity(queryQuantity - 1) }}
                    disabled={queryQuantity <= 1}
                  >
                    -
                  </Button>
                  <InputNumber
                    style={{ width: '40px' }}  // 确保InputNumber宽度合适
                    min={Math.min(1, product?.varients[selectedVarient]?.stock)}
                    max={product?.varients[selectedVarient]?.quantityLimit} value={product?.varients[selectedVarient]?.stock > 0
                      ? queryQuantity
                      : 0
                    }
                    controls={false}
                    onChange={value => {
                      if (value !== null) {
                        setQueryQuantity(value);
                      }
                    }}
                    disabled={product?.varients[selectedVarient]?.stock <= 0}
                  />
                  <Button
                    style={{ width: '30px', padding: 0 }}
                    onClick={() => {
                      !overQuantity && setQueryQuantity(queryQuantity + 1)
                    }}
                    disabled={overQuantity}
                  >
                    +
                  </Button>
                </Space.Compact>
                {product?.varients[selectedVarient]?.stock > 0
                  ? <Text type='secondary'>{
                    `库存${product?.varients[selectedVarient]?.stock}件${product?.varients[selectedVarient]?.quantityLimit ?
                      "（限购" + product?.varients[selectedVarient]?.quantityLimit + "件）"
                      : "" //无限购
                    }`
                  }</Text>
                  : <Text type='secondary'>已售罄</Text>
                }
              </Space>
              }
              {
                authCtx.isLoggedIn && product.isAvailableForPurchase &&
                <Space direction="horizontal" size="middle">
                  {
                    product.isAvailableForPurchase &&
                    <>
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
                          icon={<PayCircleOutlined />}
                          // style={{ backgroundColor: themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882" }}
                          style={{ width: '150px' }}
                          onClick={handleBuyClick}
                          disabled={selectedVarient < 0 || overQuantity}
                        >
                          {shared ? "立即租赁" : "立即购买"}
                        </Button>
                      </ConfigProvider>
                      {!shared && <Button
                        size="large"
                        type='default'
                        icon={<ShoppingCartOutlined />}
                        disabled={selectedVarient < 0 || overQuantity}
                        style={{ borderColor: themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882", width: '150px' }}
                        onClick={() => { cartCtx.addLines(product?.varients[selectedVarient]!.id, queryQuantity) }}
                      >
                        添加到爱心篮
                      </Button>}
                    </>
                  }
                </Space>
              }
              {
                (!product.isAvailableForPurchase && timeLeftMillis! > 0) &&
                <Alert
                  type='info'
                  message={
                    <Countdown
                      title="距离开售还有"
                      value={timeLeftMillis}
                      onFinish={() => setProduct({ ...product, isAvailableForPurchase: true })}
                      format="D 天 H 时 m 分 s 秒"
                      className='product-detail-countdown'
                    />
                  }
                  style={{ width: '100%', borderRadius: '6px' }}
                />
              }
              {
                !authCtx.isLoggedIn &&
                <Alert message="您尚未登录，请登录以进行购买或添加至爱心篮"
                  type="warning" showIcon />
              }
            </Space>
          </Col>
        </Row>
        <Divider />
        {
          product.desc ?
            <div className="container article-content">
              <QuillRenderer HTMLContent={product.desc} />
            </div>
            : <Alert message="该商品暂无描述。" type="info" showIcon />
        }
      </div>
      <DirectBuyConfirmModal
        isopen={isDirectBuyConfirmModalOpen}
        varient={product?.varients[selectedVarient!]}
        product={product!}
        count={queryQuantity}
        onCancel={handleDirectBuyConfirmModalCancel}
        onOk={handleDirectBuyConfirmModalOk} />
      <DirectBuyModal
        checkoutId={checkoutId!}
        isopen={isDirectBuyModalOpen}
        onClose={() => { setDirectBuyModalOpen(false) }} />
    </>
  );
};

export default ProductDetailsPage;