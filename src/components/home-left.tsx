import { Typography, List, Divider, Flex, Spin } from "antd";
import { CalendarOutlined } from "@ant-design/icons"
import { useState, useEffect, useContext } from "react";

import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { ArticleSummaries } from "@/models/article";
import { fetchArticles } from "@/services/article";

const { Text, Link } = Typography;


export const HomeLeftContent = () => {
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;
    const [noticeSummaries, setNoticeSummaries] = useState<ArticleSummaries[] | null>(null);
    const [newsSummaries, setNewsSummaries] = useState<ArticleSummaries[] | null>(null);

    useEffect(() => {
        // 暂时硬编码了通知和公告两个PageType的ID
        fetchArticles(client!, "UGFnZVR5cGU6MQ==", 6, false)
            .then(res => setNoticeSummaries(res))
            .catch(err => message.error(err));
        fetchArticles(client!, "UGFnZVR5cGU6NA==", 6, false)
            .then(res => setNewsSummaries(res))
            .catch(err => message.error(err))
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
                                        <CalendarOutlined className="secondary-text" />
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
                    <center><Spin size="default" style={{ marginTop: '50px', marginBottom: '50px' }} /></center>
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
                                        <CalendarOutlined className="secondary-text" />
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
                {!newsSummaries &&
                    <center><Spin size="default" style={{ marginTop: '50px', marginBottom: '50px' }} /></center>
                }
            </div>
        </>
    )
}