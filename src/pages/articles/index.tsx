import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { Grid, Row, Col, Divider, List, Typography, Menu, Spin, Empty } from "antd";

import { PageHeader } from "@/components/page-header";
import { ArticleSummaries } from "@/models/article";

const { Title, Link } = Typography;
const { useBreakpoint } = Grid;

const TestData: ArticleSummaries[] = [{
    "id": 1,
    "title": "Hello Markdown",
    "description": "这是一篇示例文章，在这里你可以看到常用页面元素的显示效果。",
    "author": "aixinwu",
    "publish_time": "2024-02-11T15:19:38.2493411+08:00",
    "navigation": [{ name: "通知公告", id: 0 },],
    "reads_count": 114514,
    "sort": 1,
}]

const ArticleList: React.FC = () => {
    const router = useRouter();
    const screens = useBreakpoint();
    const [articleCategories, setArticleCategories] = useState<{ name: string, id: number }[] | null>(null);
    const [articleSummaries, setArticleSummaries] = useState<ArticleSummaries[] | null>(null);
    const [currentCategory, setCurrentCategory] = useState<string>('');

    const fetchArticleCategories = async () => {
        try {
            // fetch articleCategories(type: string[]) from backend
            setArticleCategories([{ name: '通知', id: 1 }, { name: '动态', id: 2 }])
        }
        catch (error) {
            console.log(error);
            router.push('/404');
        }
    };

    const fetchArticleSummaries = async (articleCategory: number) => {
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
                        <Divider style={{ marginTop: '-10px', marginBottom: '8px' }} />
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
                        <Divider style={{ marginTop: '-10px', marginBottom: '0px' }} />
                        <List
                            itemLayout="horizontal"
                            dataSource={articleSummaries}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={<Link href={`/articles/${item.id}`}>{item.title}</Link>}
                                        description={item.description}
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