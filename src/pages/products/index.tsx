import Head from "next/head";
import React, { useState, useEffect, useContext } from "react";
import { Grid, Typography, Row, Col, Menu, Segmented, Flex, Spin, Empty, Divider } from "antd";
import type { MenuProps } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

// import Link from "next/link";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { PageHeader } from "@/components/page-header";
import { fetchCategories } from "@/services/product";
import { Category } from "@/models/products";

const { Title } = Typography;
type MenuItem = Required<MenuProps>['items'][number];

function formatMenuItem (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const ProductsPage = () => {
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);
    const [coinDirection, setCoinDirection] = useState<string>('up');
    const [selectedSortOption, setSelectedSortOption] = useState<string>('default');
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [currentCategorySlug, setCurrentCategorySlug] = useState<string | null>(null);
    
    const screens = Grid.useBreakpoint();

    useEffect(() => {
        fetchCategories(client!)
            .then(res => {
                setCategories(res);
                setCurrentCategorySlug(res[0].slug);
                console.log(res);
            })
            .catch(err => message.error(err));
    }, []);

    // 构建分类菜单项（0/1级）
    const buildMenuItems = (categories: Category[], levelLimit: number = 2): MenuItem[] =>
        categories
            .filter(category => category.level <= levelLimit)
            .map(category => {
                if (category.children && category.children.length > 0 && category.level <= levelLimit - 1)
                    return formatMenuItem(category.name, category.slug, null, buildMenuItems(category.children));
                return formatMenuItem(category.name, category.slug);
            }
    );

    // 排序方式更改辅助函数
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

    if (!categories) {
        return <center><Spin size="large" style={{ marginTop: '200px' }} /></center>;
    }

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
                        <Divider style={{ marginTop: '-6px', marginBottom: '12px' }} />
                        <Menu
                            mode={screens.md ? 'inline' : 'horizontal'}
                            selectedKeys={[`${currentCategorySlug}`]}
                            // onClick={handleMenuClick}
                            style={{ border: 'none' }}
                            items={buildMenuItems(categories)}
                        >
                        </Menu>
                        {categories.length === 0 &&
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                    </div>
                </Col>
                <Col span={screens.md ? 18 : 24}>
                    <div className="container basic-card">
                        <Flex align="flex-start" justify="space-between" style={{marginTop: '-8px'}}>
                            <Segmented
                                options={sortOptions}
                                value={selectedSortOption}
                                onChange={handleSortChange}
                            />
                        </Flex>
                        <Divider style={{ marginTop: '12px', marginBottom: '12px' }} />
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default ProductsPage;