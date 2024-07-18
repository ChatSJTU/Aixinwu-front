import Head from "next/head";
import React, { useState, useEffect, useContext } from "react";
import { Grid, Typography, Row, Col, Menu, Segmented, Flex, Spin, Empty, Divider, Pagination } from "antd";
import type { MenuProps } from 'antd';
import type { PaginationProps } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';

// import Link from "next/link";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { PageHeader } from "@/components/page-header";
import ProductGrid from "@/components/product-grid";
import { fetchCategories, fetchProductsByCategoryID } from "@/services/product";
import { Category } from "@/models/products";
import { ProductSummary } from "@/models/products";

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
    const router = useRouter();
    const { channel } = router.query;

    const [coinDirection, setCoinDirection] = useState<string>('up');
    const [selectedSortOption, setSelectedSortOption] = useState<string>('default');
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [flatCategories, setFlatCategories] = useState<Category[]>([]); // 扁平化的分类列表
    const [currentCategoryID, setCurrentCategoryID] = useState<string[] | null>(null);
    const [shownProducts, setShownProducts] = useState<ProductSummary[] | null>(null);
    const [shownProductsPage, setShownProductsPage] = useState(1);
    const [currentChannel, setCurrentChannel] = useState<string>("");
    
    const screens = Grid.useBreakpoint();

    useEffect(() => {
        if (channel == undefined || channel == "")
            return;
        setCurrentChannel(channel as string);
        fetchCategories(client!, channel as string)
            .then(({ flatList, treeCategories }) => {
                console.log(treeCategories);
                setCategories(treeCategories);
                setCurrentCategoryID(flatList.map(category => category.id));
                setFlatCategories(flatList);
                // fetchProductsByCategoryID(client!, 24, treeCategories[0].id, selectedSortOption)
                //     .then(products => setShownProducts(products))
                //     .catch(err => message.error(err));
                })
            .catch(err => message.error(err));
    }, [channel, router]);

    useEffect(() => {
        if (!currentCategoryID) return;
        fetchProductsByCategoryID(client!, currentChannel, 24, currentCategoryID!, selectedSortOption)
            .then(products => setShownProducts(products))
            .catch(err => message.error(err));
    }, [currentCategoryID, selectedSortOption]);

    // 构建分类菜单项（0/1级）
    const buildMenuItems = (categories: Category[], levelLimit: number = 2): MenuItem[] =>
        categories
            .filter(category => category.level <= levelLimit)
            .map(category => {
                if (category.products?.totalCount === 0) return null;
                if (category.children && category.children.length > 0 && category.level <= levelLimit - 1)
                    return formatMenuItem(
                            <>{category.name} <span className="secondary-text">{`(${category.products?.totalCount || 0})`}</span></>, 
                            category.id, 
                            null, 
                            buildMenuItems(category.children)
                        );
                return formatMenuItem(<>{category.name} <span className="secondary-text">{`(${category.products?.totalCount || 0})`}</span></>, category.id);
            }
    );

    const handleMenuClick = (e: any) => {
        if (e.key === 'all') {
            setCurrentCategoryID(flatCategories.map(category => category.id));
            setShownProductsPage(1);
            return;
        }
        if (([e.key] as string[]) === currentCategoryID) return;
        setCurrentCategoryID([e.key]);
        setShownProductsPage(1);
        // fetchProductsByCategoryID(client!, 24, e.key, selectedSortOption)
        //     .then(products => setShownProducts(products))
        //     .catch(err => message.error(err));
    };

    const handlePageinationChange: PaginationProps['onChange'] = (page) => {
        setShownProductsPage(page);
        fetchProductsByCategoryID(client!, currentChannel, page * 24, currentCategoryID!, selectedSortOption)
            .then(products => setShownProducts(products))
            .catch(err => message.error(err));
    };

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
            <PageHeader title={currentChannel === process.env.NEXT_PUBLIC_CHANNEL2 ? "租赁专区" : "置换专区"}/>
            <Row>
                <Col span={screens.md ? 6 : 24}>
                    <div className="container basic-card">
                        <Title level={5}>分类</Title>
                        <Divider style={{ marginTop: '-6px', marginBottom: '12px' }} />
                        <Menu
                            mode={screens.md ? 'inline' : 'horizontal'}
                            selectedKeys={currentCategoryID?.length === 1 ? currentCategoryID : ['all']}
                            onClick={handleMenuClick}
                            style={{ border: 'none' }}
                            items={[ formatMenuItem('所有商品', 'all', <AppstoreOutlined />), 
                                ...buildMenuItems(categories) ]}
                        >
                        </Menu>
                        {categories.length === 0 &&
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                    </div>
                </Col>
                <Col span={screens.md ? 18 : 24}>
                    <div className="container basic-card" style={{overflowY: 'visible'}}>
                        <Flex align="flex-start" justify="space-between" style={{marginTop: '-8px'}}>
                            <Segmented
                                options={sortOptions}
                                value={selectedSortOption}
                                onChange={handleSortChange}
                            />
                        </Flex>
                        <Divider style={{ marginTop: '12px', marginBottom: '22px' }} />
                        <ProductGrid products={shownProducts || []} rowNum={100}/>
                        <Flex align="flex-start" justify="flex-end" style={{ marginTop: '12px'}}>
                            <Pagination 
                                current={shownProductsPage} 
                                onChange={handlePageinationChange}
                                total={currentCategoryID ?
                                    flatCategories.reduce((sum, category) => {
                                        if (!category.children?.length && currentCategoryID.includes(category.id)) {
                                            return sum + (category.products?.totalCount || 0);
                                        }
                                        return sum;
                                    }, 0)
                                : 0}
                                pageSize={24}
                                showTotal={(total) => `共 ${total} 件商品`}
                                />
                        </Flex>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default ProductsPage;