import React, { useState, useContext, useEffect, use } from "react";
import { useRouter } from 'next/router';
import Head from "next/head";
import { Typography, Flex, Divider, Segmented, Pagination, Input, List, Select} from "antd";
import type { PaginationProps } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ShoppingOutlined, FileTextOutlined, CalendarOutlined, HourglassOutlined } from "@ant-design/icons";

import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { PageHeader } from "@/components/page-header";
import ProductGrid from "@/components/product-grid";
import { ProductSummary } from "@/models/products";
import { ArticleSummary } from "@/models/article";

import { searchProducts } from "@/services/product";
import { searchArticles } from "@/services/article";
import { channel } from "diagnostics_channel";

const { Search } = Input;
const { Text, Link } = Typography;

const SearchResultPage = () => {
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;
    const router = useRouter();
    const { query } = router;
    const message = useContext(MessageContext);

    const [coinDirection, setCoinDirection] = useState<string>('up');
    const [selectedSortOption, setSelectedSortOption] = useState<string>('default');    // 商品结果的排序方式
    const [searchDomain, setSearchDomain] = useState<string>('products');   // 搜索域：商品或文章
    const [shownPage, setShownPage] = useState<number>(1);  // 分页器当前页
    const [pageSize, setPageSize] = useState<number>(10);  // 分页器每页显示数量（仅针对文章列表分页）
    const [totalResultsCount, setTotalResultsCount] = useState<number>(0);  // 总搜索结果数
    const [resultList, setResultList] = useState<ProductSummary[] | ArticleSummary[]>([]);  // 搜索结果列表

    useEffect(() => {
        if (query.keyword && query.domain && query.sort && query.page) {
            const keyword = query.keyword as string;
            const domain = query.domain as string;
            const sort = query.sort as string;
            const page = parseInt(query.page as string, 10);
            setSearchDomain(domain);
            setSelectedSortOption(sort);
            if (sort.startsWith('price-')) {
                setCoinDirection(sort.split('-')[1]);
            }
            setShownPage(page);
            handleSearch(page, keyword, domain, sort);
        }
    }, [query]);

    // 搜索
    const handleSearch = (page: number = 1, keyword: string, domain: string = "products", sort: string = "default") => {
        if (keyword === "") {
            message.error('搜索关键词不能为空');
            return;
        }
        // console.log(first, keyword, domain, sort)
        if (domain === 'products' || domain === 'rent') {
            if (page <= 0) { page = 1; }
            searchProducts(client!, page * 24, keyword.trim(), sort, domain)
                .then(({totalCount, productSummaries}) => {
                    setTotalResultsCount(totalCount || 0);
                    setResultList(productSummaries);
                })
                .catch(err => console.error(err));
        }
        if (domain === 'articles') {
            if (page <= 0) { page = 1; }
            searchArticles(client!, page * pageSize, pageSize, keyword.trim())
                .then(({totalCount, articleSummaries}) => {
                    setTotalResultsCount(totalCount || 0);
                    setResultList(articleSummaries);
                })
                .catch(err => console.error(err));
        }
        // TODO: 文章搜索
    }
    
    // 排序方式更改辅助函数
    const handleSortChange = (value: string) => {
        let sortKey = ""
        if (value.startsWith('price')) {
            if (selectedSortOption === value) {
                let newDirection = coinDirection === 'up' ? 'down' : 'up';
                setCoinDirection(newDirection);
                sortKey = `price-${newDirection}`
            } else {
                sortKey = value;
            }
        } else {
            sortKey = value;
        }
        setSelectedSortOption(sortKey);
        router.push({
            pathname: router.pathname,
            query: {
                ...query,
                sort: sortKey,
                page: 1,
            }
        });
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

    const handlePageinationChange: PaginationProps['onChange'] = (page) => {
        setShownPage(page);
        router.push({
            pathname: router.pathname,
            query: {
                ...query,
                page,
            }
        });
    };

    const handlePageinationShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
        setPageSize(pageSize);
        router.push({
            pathname: router.pathname,
            query: {
                ...query,
                page: 1,
            }
        });
    };

    const handleDomainChange = (value: string) => {
        setResultList([]);
        router.push({
            pathname: router.pathname,
            query: {
                ...query,
                domain: value,
                page: 1,
            }
        });
        setSearchDomain(value);
    };

    const handleSearchInput = (value: string) => {
        if (value === undefined || value.trim() === ""){
            if (query.keyword === undefined || query.keyword === "") {
                message.error('搜索关键词不能为空');
                return;
            }
            else value = query.keyword as string;
        }
        router.push({
            pathname: router.pathname,
            query: {
                keyword: value.trim(),
                domain: searchDomain,
                sort: selectedSortOption,
                page: 1,
            }
        });
    };

    return (
        <>
            <Head>
                {(query.keyword === undefined || query.keyword === "") 
                    ? <title>搜索 - 上海交通大学绿色爱心屋</title>
                    : <title>"{query.keyword}"的搜索结果 - 上海交通大学绿色爱心屋</title>
                }
            </Head>
            {(query.keyword === undefined || query.keyword === "") 
                ? <PageHeader title="搜索"/>
                : <PageHeader title={`${totalResultsCount} 条与“${query.keyword}”有关的结果`}/>
            }
            {}
            <div className="container basic-card">
                <Flex>
                    <Select 
                        value={searchDomain}
                        style={{ width: 180 }} 
                        size="large"
                        options={[
                            { label: <><ShoppingOutlined /> 置换</>, value: 'products' },
                            { label: <><HourglassOutlined /> 租赁</>, value: 'rent' },
                            { label: <><FileTextOutlined /> 文章</>, value: 'articles' }
                        ]}
                        onChange={handleDomainChange}
                    />
                    <Search 
                        placeholder={(query.keyword === undefined || query.keyword === "") ? "请输入关键词" : query.keyword}
                        enterButton 
                        size="large" 
                        style={{ marginLeft: '18px'}}
                        onSearch={handleSearchInput}
                    />
                </Flex>
            </div>
            <div className="container basic-card" style={{overflowY: 'visible'}}>
                {(searchDomain === "products" || searchDomain === "rent") && 
                    <>
                        <Flex align="flex-start" justify="space-between" style={{marginTop: '-8px'}}>
                            <Segmented
                                options={sortOptions}
                                value={selectedSortOption}
                                onChange={handleSortChange}
                                defaultValue={selectedSortOption}
                            />
                        </Flex>
                        <Divider style={{ marginTop: '16px', marginBottom: '18px' }} />
                        <ProductGrid products={resultList as ProductSummary[]} rowNum={100}/>
                        <Flex align="flex-start" justify="flex-end" style={{ marginTop: '24px'}}>
                            <Pagination 
                                current={shownPage} 
                                onChange={handlePageinationChange}
                                total={totalResultsCount}
                                pageSize={24}
                                showTotal={(total) => `共 ${total} 个结果`}
                                />
                        </Flex>
                    </>
                }
                {searchDomain === "articles" &&
                    <>
                        <List
                            itemLayout="horizontal"
                            dataSource={resultList as ArticleSummary[]}
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
                        <Flex align="flex-start" justify="flex-end" style={{ marginTop: '24px'}}>
                            <Pagination 
                                current={shownPage} 
                                showSizeChanger
                                onChange={handlePageinationChange}
                                onShowSizeChange={handlePageinationShowSizeChange}
                                total={totalResultsCount}
                                pageSize={pageSize}
                                showTotal={(total) => `共 ${total} 个结果`}
                                />
                        </Flex>
                    </>
                }
            </div>
        </>
    );
};
export default SearchResultPage;