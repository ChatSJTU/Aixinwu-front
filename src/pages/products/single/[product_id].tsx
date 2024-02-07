import { Image, Spin, Divider, Row, Col, Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AxCoin } from '@/components/axcoin';

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
        <div>
            <Row>
                <Col span={6}>
                    <div>
                        <Image
                            src={productDetails.image_url}
                            alt={productDetails.product_name}
                            width={256}
                            height={256}
                        />
                    </div>
                </Col>
                <Col span={18} style={{paddingLeft: '250px'}}>
                    <div>
                        <h1>{productDetails.product_name}</h1>
                        {productDetails.detailed_product_name && (
                            <h3>{productDetails.detailed_product_name}</h3>
                        )}
                        <p style={{ display: 'flex', alignItems: 'center' }}>
                            爱心币：<AxCoin size={16} />
                            <span style={{ color: '#eb2f96' }}>{productDetails.cost}</span>
                        </p>
                        {productDetails.stock && (
                            <p>库存: {productDetails.stock}</p>
                        )}
                        <Button 
                        type='primary'
                        icon={<ShoppingCartOutlined/>}
                        style={{backgroundColor: '#eb2f96'}}
                        onClick={()=>{}}
                        >
                            添加到爱心篮
                        </Button>
                    </div>
                </Col>
            </Row>
            <Divider />
            <p style={{ whiteSpace: 'pre-line' }} >{productDetails.desc}</p>

        </div>
    );
};

export default ProductDetailsPage;