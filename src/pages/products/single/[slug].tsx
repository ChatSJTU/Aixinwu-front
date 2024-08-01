import {
  Image, Spin, Divider, Row, Col, Button,
  Typography, Carousel, Breadcrumb, Space, InputNumber,
  Tooltip, Grid, Radio, Modal, ConfigProvider, Alert
} from 'antd'
import {
  ShoppingCartOutlined,
  InfoCircleFilled,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import Head from "next/head";
import { useEffect, useState, useContext } from 'react';
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
  const [selectedVarient, setSelectedVarient] = useState<number>(-Infinity);
  const [queryQuantity, setQueryQuantity] = useState<number>(1);

  const [isDirectBuyModalOpen, setDirectBuyModalOpen] = useState<boolean>(false);

  const overQuantity = (
    queryQuantity > product?.varients[selectedVarient]?.quantityLimit!
    || queryQuantity > product?.varients[selectedVarient]?.stock!
    || queryQuantity > 50
  );

  const previewProps = isMobile
    ? false
    : {
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
    confirm({
      title: '下单确认',
      icon: <InfoCircleFilled />,
      content: (
        <span>
          {'是否确认购买 '}
          {product?.name}
          {product?.varients[selectedVarient] && `（${product?.varients[selectedVarient].name}）`}
        </span>
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
                      preview={previewProps}
                    />
                  </Tooltip>
                )) || (
                  <Image
                    key={index}
                    src={url}
                    alt={`图片预览 ${index + 1}`}
                    width={468}
                    height={468}
                    preview={previewProps}
                  />
                )
              ))}
            </Carousel>
          </Col>
          {isMobile &&
            <Divider />
          }
          <Col span={isMobile ? 24 : 15}
            style={isMobile ? { justifyContent: 'center' } : { paddingLeft: '150px' }}
          >
            <Space direction='vertical' size={'large'}>
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {selectedVarient >= 0
                  ? <AxCoin size={24} value={product?.varients[selectedVarient]?.price} coloredValue={true} />
                  : (product?.price.min === product?.price.max)
                    ? <AxCoin size={24} value={product?.price.min} coloredValue={true} />
                    : <AxCoin size={24} value={product?.price.min} maxValue={product?.price.max} shownRange={true} coloredValue={true} />
                }
              </div>
              {selectedVarient >= 0 &&
                <Text type='secondary'>{`已售出 ${product.varients[selectedVarient].sold} 件`}</Text>
              }
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
                    max={Math.min(
                      product?.varients[selectedVarient]?.quantityLimit,
                      product?.varients[selectedVarient]?.stock,
                      50
                    )} value={product?.varients[selectedVarient]?.stock > 0
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
                    `库存${product?.varients[selectedVarient]?.stock}件（限购${product?.varients[selectedVarient]?.quantityLimit}件）`
                  }</Text>
                  : <Text type='secondary'>已售罄</Text>
                }
              </Space>}
              <Space size="middle" style={{ width: "100%" }}>
                {
                  authCtx.isLoggedIn &&
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
                      disabled={selectedVarient < 0 || overQuantity}
                    >
                      立即购买
                    </Button>
                  </ConfigProvider>
                }
                {
                  authCtx.isLoggedIn &&
                  <Button
                    size="large"
                    type='default'
                    icon={<ShoppingCartOutlined />}
                    disabled={selectedVarient < 0 || overQuantity}
                    style={{ borderColor: themeCtx.userTheme == 'light' ? "#EB2F96" : "#CD2882" }}
                    onClick={() => { cartCtx.addLines(product?.varients[selectedVarient]!.id, queryQuantity) }}
                  >
                    添加到爱心篮
                  </Button>
                }
                {
                  !authCtx.isLoggedIn &&
                  <Alert message="您尚未登录，请登录以进行购买或添加至爱心篮"
                    type="warning" showIcon />
                }
              </Space>
            </Space>
          </Col>
        </Row>
        <Divider />
        <div className="container article-content">
          <MarkdownRenderer content={product.desc} />
        </div>
      </div>
      <DirectBuyModal
        isopen={isDirectBuyModalOpen}
        varient={product?.varients[selectedVarient!]}
        product={product!}
        count={queryQuantity}
        onClose={handleDirectBuyModalClose} />
    </>
  );
};

export default ProductDetailsPage;