import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { useRouter } from 'next/router';
import { Grid, Row, Col, Divider, List, Typography, Menu, Spin, Empty, Flex } from "antd";
import { CalendarOutlined } from "@ant-design/icons"

import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { PageHeader } from "@/components/page-header";
import { ArticleSummaries } from "@/models/article";
import { fetchArticleCategories, fetchArticlesByType } from "@/services/article";

const { Title, Link, Text } = Typography;
const { useBreakpoint } = Grid;

const ArticleList: React.FC = () => {
    const router = useRouter();
    const screens = useBreakpoint();
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;
    const [articleCategories, setArticleCategories] = useState<{ name: string, id: string }[] | null>(null);
    const [articleSummaries, setArticleSummaries] = useState<ArticleSummaries[] | null>(null);
    const [currentCategoryID, setcurrentCategoryID] = useState<string | null>(null);

    useEffect(() => {
        fetchArticleCategories(client!)
            .then(res => {
                setArticleCategories(res);
                setcurrentCategoryID(res[0].id);
            })
            .catch(err => message.error(err));
    }, []);

    useEffect(() => {
        if (currentCategoryID) {
            fetchArticlesByType(client!, currentCategoryID, 20)
                .then(res => setArticleSummaries(res))
                .catch(err => message.error(err))
        }

    }, [currentCategoryID]);

    const handleMenuClick = (e: any) => {
        setcurrentCategoryID(e.key);
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
                            selectedKeys={[currentCategoryID!]}
                            onClick={handleMenuClick}
                            style={{ border: 'none' }}
                        >
                            {articleCategories.map(category => (
                                <Menu.Item key={category.id}>{category.name}</Menu.Item>
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
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default ArticleList;