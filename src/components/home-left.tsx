import { Typography, List, Divider, Spin } from "antd";
import { CalendarOutlined } from "@ant-design/icons"
import { useState, useEffect, useContext } from "react";

import BasicCard from "@/components/basic-card";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { ArticleSummaries } from "@/models/article";
import { fetchArticlesByType } from "@/services/article";

const { Text, Link } = Typography;


export const HomeLeftContent = () => {
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;
    const [noticeSummaries, setNoticeSummaries] = useState<ArticleSummaries[] | null>(null);
    const [newsSummaries, setNewsSummaries] = useState<ArticleSummaries[] | null>(null);

    function formatPublishTime(publishTime: string | Date): string {
        const publishDate = new Date(publishTime).getTime();
        const currentDate = new Date().getTime();
        const timeDifference = currentDate - publishDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

        if (daysDifference === 0) return '今天';
        else if (daysDifference === 1) return '昨天';

        if (daysDifference <= 31) {
            return `${daysDifference}天前`;
        } else if (daysDifference <= 365) {
            return `${Math.floor(daysDifference / 30)}个月前`;
        } else {
            return `${Math.floor(daysDifference / 365)}年前`;
        }
    }

    useEffect(() => {
        // 暂时硬编码了通知和公告两个PageType的ID
        fetchArticlesByType(client!, "UGFnZVR5cGU6NQ==", 6)
            .then(res => setNoticeSummaries(res))
            .catch(err => message.error(err));
        fetchArticlesByType(client!, "UGFnZVR5cGU6NA==", 6)
            .then(res => setNewsSummaries(res))
            .catch(err => message.error(err))
    }, [])

    return (
        <>
            <BasicCard title="通知" divider
                titleExtra={
                    <Link href="/articles" target="_blank">{'更多>>'}</Link>
                }
            >
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
                                            {formatPublishTime(item.publish_time)}
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
            </BasicCard>
            <BasicCard title="动态" divider
                titleExtra={
                    <Link href="/articles" target="_blank">{'更多>>'}</Link>
                }
            >
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
                                            {formatPublishTime(item.publish_time)}
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
            </BasicCard>
        </>
    )
}