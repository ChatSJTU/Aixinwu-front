import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { Breadcrumb, Row, Col, Divider, List, Typography, Menu, Spin } from "antd";

import { ArticleSummaries } from "@/models/article";

const { Title, Link } = Typography;

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
    const [articleCategories, setArticleCategories] = useState<string[]>([]);
    const [articleSummaries, setArticleSummaries] = useState<ArticleSummaries[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string>('');

    const fetchArticleCategories = async () => {
        try {
            // fetch articleCategories(type: string[]) from backend
            setArticleCategories(['测试分类1', '测试分类2', '测试分类3', '测试分类4', '测试分类5', '测试分类6'])
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
        if (articleCategories[0]) {
            setCurrentCategory(articleCategories[0]);
            fetchArticleSummaries(articleCategories[0]);
        }
    }, [articleCategories]);

    const handleMenuClick = (e: any) => {
        setCurrentCategory(e.key);
        fetchArticleSummaries(e.key);
    };

    if (!articleCategories) {
        return <center><Spin size="large" style={{ marginTop: '200px' }} /></center>;
    }

    return (
        <>
            <Head>
                <title>文章总览-上海交通大学绿色爱心屋</title>
            </Head>
            <Breadcrumb style={{ margin: "4px 12px 4px 12px" }}
                items={[
                    { title: <Link href="/">首页</Link> },
                    { title: <Link href="/articlelist">文章总览</Link> },
                ]}
            />
            <Row>
                <Col span={6}>
                    <div className="container basic-card">
                        <Title level={4}>分类</Title>
                        <Divider style={{ marginTop: '-10px', marginBottom: '8px' }}/>
                        {/* Display an antd:Menu component, each item shows a string in articleCategories, 
                            when clicked, wait fetchArticleSummaries(category) to be completed*/}
                        <Menu
                            mode="vertical"
                            selectedKeys={[currentCategory]}
                            onClick={handleMenuClick}
                            style={{border: 'none'}}
                        >
                            {articleCategories.map(category => (
                                <Menu.Item key={category}>{category}</Menu.Item>
                            ))}
                        </Menu>
                    </div>
                </Col>
                <Col span={18}>
                    <div className="container basic-card">
                        <Title level={4}>文章列表</Title>
                        <Divider style={{ marginTop: '-10px', marginBottom: '0px' }}/>
                        {/* Display List of Links whose titles are articleSummaries: title and hrefs are "/articles/${id}" */}
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