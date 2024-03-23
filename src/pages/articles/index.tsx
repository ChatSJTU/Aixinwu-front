import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { Grid, Row, Col, Divider, List, Typography, Menu, Spin, Empty, Flex } from "antd";
import { CalendarOutlined } from "@ant-design/icons"

import { PageHeader } from "@/components/page-header";
import { ArticleSummaries } from "@/models/article";

const { Title, Link, Text } = Typography;
const { useBreakpoint } = Grid;

const TestData: ArticleSummaries[] = [{
    "id": "1",
    "title": "Hello Markdown",
    "description": "这是一篇示例文章，在这里你可以看到常用页面元素的显示效果。",
    "publish_time": "2024-02-11T15:19:38.2493411+08:00",
    "navigation": [{ name: "通知公告", id: "0" },],
}]

const ArticleList: React.FC = () => {
    const router = useRouter();
    const screens = useBreakpoint();
    const [articleCategories, setArticleCategories] = useState<{ name: string, id: string }[] | null>(null);
    const [articleSummaries, setArticleSummaries] = useState<ArticleSummaries[] | null>(null);
    const [currentCategory, setCurrentCategory] = useState<string>('');

    const fetchArticleCategories = async () => {
        try {
            // fetch articleCategories(type: string[]) from backend
            setArticleCategories([{ name: '通知', id: "1" }, { name: '动态', id: "2" }])
        }
        catch (error) {
            console.log(error);
            router.push('/404');
        }
    };

    const fetchArticleSummaries = async (articleCategory: string) => {
        try {
            // fetch articleSummarie(type: ArticleSummaries[]) from backend
            setArticleSummaries([...TestData, ...TestData, ...TestData, ...TestData]);
        }
        catch (error) {
            console.log(error);
            router.push('/404');
        }
    };

    useEffect(() => {
        fetchArticleCategories();
    }, []);

    useEffect(() => {
        if (articleCategories && articleCategories[0]) {
            setCurrentCategory(articleCategories[0].name);
            fetchArticleSummaries(articleCategories[0].id);
        }
    }, [articleCategories]);

    const handleMenuClick = (e: any) => {
        setCurrentCategory(e.key);
        fetchArticleSummaries(e.key);
    };

    if (!articleCategories || !articleSummaries) {
        return <center><Spin size="large" style={{ marginTop: '200px' }} /></center>;
    }

    return (
        <>
            <Head>
                <title>文章总览 - 上海交通大学绿色爱心屋</title>
            </Head>
            <PageHeader title="文章列表" />
            <Row>
                <Col span={screens.md ? 6 : 24}>
                    <div className="container basic-card">
                        <Title level={5}>分类</Title>
                        <Divider style={{ marginTop: '-6px', marginBottom: '12px' }} />
                        <Menu
                            mode={screens.md ? 'vertical' : 'horizontal'}
                            selectedKeys={[currentCategory]}
                            onClick={handleMenuClick}
                            style={{ border: 'none' }}
                        >
                            {articleCategories.map(category => (
                                <Menu.Item key={category.name}>{category.name}</Menu.Item>
                            ))}
                        </Menu>
                        {articleCategories.length === 0 &&
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                    </div>
                </Col>
                <Col span={screens.md ? 18 : 24}>
                    <div className="container basic-card">
                        <Title level={5}>{`共有${articleSummaries.length}篇文章`}</Title>
                        <Divider style={{ marginTop: '-6px', marginBottom: '4px' }} />
                        <List
                            itemLayout="horizontal"
                            dataSource={articleSummaries}
                            renderItem={item => (
                                <List.Item
                                    extra={
                                        <Flex justify="space-between" align="flex-start">
                                            <div>
                                                <CalendarOutlined className="secondary-text" />
                                                <Text type="secondary" style={{ fontWeight: 'normal', marginLeft: '4px' }}>
                                                    {new Date(item.publish_time).toISOString().split('T')[0]}
                                                </Text>
                                            </div>
                                        </Flex>
                                    }
                                >
                                    <List.Item.Meta
                                        title={
                                            <div className="link-container-ellipsis" style={{maxWidth: '800px'}}>
                                                <Link className="link-ellipsis" href={`/articles/${item.id}`} target="_blank">{item.title}</Link>
                                            </div>
                                        }
                                        description={<Text type="secondary">{item.description}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default ArticleList;