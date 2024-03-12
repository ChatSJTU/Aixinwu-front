import Head from "next/head";
import { useState, useEffect} from "react";
// import Link from "next/link";
import { Grid, Typography, Row, Col, Space, Segmented, Flex } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { PageHeader } from "@/components/page-header";

const { Title } = Typography;

const ProductsPage = () => {
    const [coinDirection, setCoinDirection] = useState<string>('up');
    const [selectedSortOption, setSelectedSortOption] = useState<string>('default');

    const screens = Grid.useBreakpoint();

    // useEffect(() => {
    //     console.log(selectedSortOption);
    // }, [selectedSortOption])

    const handleSortChange = (value: string) => {
        if (value.startsWith('price')) {
            if (selectedSortOption === value) {
                let newDirection = coinDirection === 'up' ? 'down' : 'up';
                setCoinDirection(newDirection);
                setSelectedSortOption(`price-${newDirection}`);
            } else {
                setSelectedSortOption(value);
            }
        } else {
            setSelectedSortOption(value);
        }
    };

    const sortOptions: { label: React.ReactNode; value: string }[] = [
        { label: '默认排序', value: 'default' },
        { label: '上架时间', value: 'time' },
        {
            label: (
                <div
                    onClick={() => {handleSortChange(`price-${coinDirection}`)}}
                >
                    价格 {coinDirection === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                </div>
            ),
            value: `price-${coinDirection}`,
        },
    ];

    //TODO 获取商品分类列表与当前分类id

    return (
        <>
            <Head>
                <title>商品列表 - 上海交通大学绿色爱心屋</title>
            </Head>
            <PageHeader title="置换专区"/>
            <Row>
                <Col span={screens.md ? 6 : 24}>
                    <div className="container basic-card">
                        <Title level={5}>分类</Title>
                    </div>
                </Col>
                <Col span={screens.md ? 18 : 24}>
                    <div className="container basic-card">
                        <Flex align="flex-start" justify="space-between" style={{marginTop: '-6px'}}>
                            <Segmented
                                options={sortOptions}
                                value={selectedSortOption}
                                onChange={handleSortChange}
                            />
                        </Flex>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default ProductsPage;