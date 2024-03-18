import { Typography, List, Divider, Flex, Spin } from "antd";
import { CalendarOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react";
import { ArticleSummaries } from "@/models/article";

const { Text, Link } = Typography;

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

export const HomeLeftContent = () => {
    const [noticeSummaries, setNoticeSummaries] = useState<ArticleSummaries[] | null>(null);
    const [newsSummaries, setNewsSummaries] = useState<ArticleSummaries[] | null>(null);

    const fetchArticleSummaries = async (articleCategory: number) => {
        try {
            // fetch articleSummarie(type: ArticleSummaries[]) from backend
            if (articleCategory === 0) {
                setNoticeSummaries([...TestData, ...TestData, ...TestData, ...TestData].slice(0,4));
            }
            else if (articleCategory === 1) {
                setNewsSummaries([...TestData, ...TestData, ...TestData, ...TestData].slice(0,2));
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchArticleSummaries(0);
        fetchArticleSummaries(1);
    }, [])

    return (
        <>
            <div className="container basic-card">
                <Flex align="center" justify="space-between">
                    <Text strong style={{ fontSize: '16px' }}>通知</Text>
                    <Link href="/articles" target="_blank">{"更多>>"}</Link>
                </Flex>
                <Divider style={{ marginTop: '-8px', marginBottom: '4px' }} />
                {noticeSummaries &&
                    <List
                        itemLayout="horizontal"
                        dataSource={noticeSummaries}
                        renderItem={item => (
                            <List.Item
                                extra={
                                    <div>
                                        <CalendarOutlined className="secondary-text"/>
                                        <Text type="secondary" style={{ fontWeight: 'normal', marginLeft: '4px' }}>
                                            {new Date(item.publish_time).toISOString().split('T')[0]}
                                        </Text>
                                    </div>
                                }
                            >
                                <List.Item.Meta
                                    title={
                                        <div className="link-container-ellipsis">
                                        <Link className="link-ellipsis" href={`/articles/${item.id}`} target="_blank">{item.title}</Link>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                }
                {!noticeSummaries &&
                    <center><Spin size="large" style={{ marginTop: '200px' }} /></center>
                }
            </div>
            <div className="container basic-card">
                <Flex align="center" justify="space-between">
                    <Text strong style={{ fontSize: '16px' }}>动态</Text>
                    <Link href="/articles">{"更多>>"}</Link>
                </Flex>
                <Divider style={{ marginTop: '-8px', marginBottom: '4px' }} />
                {newsSummaries &&
                    <List
                        itemLayout="horizontal"
                        dataSource={newsSummaries}
                        renderItem={item => (
                            <List.Item
                                extra={
                                    <div>
                                        <CalendarOutlined className="secondary-text"/>
                                        <Text type="secondary" style={{ fontWeight: 'normal', marginLeft: '4px' }}>
                                            {new Date(item.publish_time).toISOString().split('T')[0]}
                                        </Text>
                                    </div>
                                }
                            >
                                <List.Item.Meta
                                    title={
                                        <div className="link-container-ellipsis">
                                        <Link className="link-ellipsis" href={`/articles/${item.id}`} target="_blank">{item.title}</Link>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                }
                {!noticeSummaries &&
                    <center><Spin size="large" style={{ marginTop: '200px' }} /></center>
                }
            </div>
        </>
    )
}