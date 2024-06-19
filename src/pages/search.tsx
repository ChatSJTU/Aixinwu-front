import React, { useState } from "react";
import Head from "next/head";
import { Typography, Flex, Divider, Segmented, Pagination, Input, List, Select} from "antd";
import { PageHeader } from "@/components/page-header";
import ProductGrid from "@/components/product-grid";
import { ArrowUpOutlined, ArrowDownOutlined, ShoppingOutlined, FileTextOutlined, CalendarOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Text, Link } = Typography;

const SearchResultPage = () => {
    const [coinDirection, setCoinDirection] = useState<string>('up');
    const [selectedSortOption, setSelectedSortOption] = useState<string>('default');
    const [searchDomain, setSearchDomain] = useState<string>('products');

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

    return (
        <>
            <Head>
                <title> 搜索结果 - 上海交通大学绿色爱心屋</title>
            </Head>
            <PageHeader title="搜索结果"/>
            <div className="container basic-card">
                <Flex>
                    <Select 
                        defaultValue={searchDomain}
                        style={{ width: 180 }} 
                        size="large"
                        options={[
                            { label: <><ShoppingOutlined /> 商品</>, value: 'products' },
                            { label: <><FileTextOutlined /> 文章</>, value: 'articles' }
                        ]}
                        onChange={(value) => setSearchDomain(value)}
                    />
                    <Search 
                        placeholder="input search text" 
                        enterButton 
                        size="large" 
                        style={{ marginLeft: '18px'}}
                    />
                </Flex>
            </div>
            <div className="container basic-card" style={{overflowY: 'visible'}}>
                {searchDomain === "products" && 
                    <>
                        <Flex align="flex-start" justify="space-between" style={{marginTop: '-8px'}}>
                            <Segmented
                                options={sortOptions}
                                value={selectedSortOption}
                                onChange={handleSortChange}
                            />
                        </Flex>
                        <Divider style={{ marginTop: '16px', marginBottom: '18px' }} />
                        <ProductGrid products={[]} rowNum={100}/>
                        <Flex align="flex-start" justify="flex-end" style={{ marginTop: '24px'}}>
                            {/* <Pagination 
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
                                /> */}<></>
                        </Flex>
                    </>
                }
                {searchDomain === "articles" &&
                    <List
                    itemLayout="horizontal"
                    dataSource={[{id: 1, title: '文章标题', description: '文章描述', publish_time: '2021-09-01T00:00:00'}]}
                    renderItem={item => (
                        <List.Item
                            extra={
                                <Flex justify="space-between" align="flex-start">
                                    <div>
                                        <CalendarOutlined className="secondary-text" />
                                        <Text type="secondary" style={{ fontWeight: 'normal', marginLeft: '4px' }}>
                                            {item.publish_time.split('T')[0]}
                                        </Text>
                                    </div>
                                </Flex>
                            }
                        >
                            <List.Item.Meta
                                title={
                                    <div className="link-container-ellipsis" style={{ maxWidth: '800px' }}>
                                        <Link className="link-ellipsis" href={`/articles/${item.id}`} target="_blank">{item.title}</Link>
                                    </div>
                                }
                                description={<Text type="secondary">{item.description}</Text>}
                            />
                        </List.Item>
                    )}
                />
                }
            </div>
        </>
    );
};
export default SearchResultPage;