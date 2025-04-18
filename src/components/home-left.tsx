import { Typography, List, Tooltip, Spin } from "antd";
import { CalendarOutlined } from "@ant-design/icons"
import { useState, useEffect, useContext } from "react";

import BasicCard from "@/components/basic-card";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { ArticleSummary } from "@/models/article";
import { fetchArticlesByType } from "@/services/article";

const { Text, Link } = Typography;


export const HomeLeftContent = () => {
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;
    const [noticeSummaries, setNoticeSummaries] = useState<ArticleSummary[] | null>(null);
    const [newsSummaries, setNewsSummaries] = useState<ArticleSummary[] | null>(null);

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
        fetchArticlesByType(client!, 10, 10, process.env.NEXT_PUBLIC_PAGE_TYPE_1!)
            .then(res => setNoticeSummaries(res.articleSummaries))
            .catch(err => message.error(err));
        fetchArticlesByType(client!, 10, 10, process.env.NEXT_PUBLIC_PAGE_TYPE_2!)
            .then(res => setNewsSummaries(res.articleSummaries))
            .catch(err => message.error(err))
    }, [])

    return (
        <>
            <BasicCard title="通知" divider
                titleExtra={
                    <Link href="/articles">{'更多>>'}</Link>
                }
            >
                {noticeSummaries &&
                    <List
                        itemLayout="horizontal"
                        dataSource={noticeSummaries}
                        renderItem={item => (
                            <Tooltip placement="right" title={item.title}>
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
                                                <Link className="link-ellipsis" href={`/articles/${item.id}`} >{item.title}</Link>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            </Tooltip>
                        )}
                    />
                }
                {!noticeSummaries &&
                    <center><Spin size="default" style={{ marginTop: '50px', marginBottom: '50px' }} /></center>
                }
            </BasicCard>
            <BasicCard title="动态" divider
                titleExtra={
                    <Link href="/articles" >{'更多>>'}</Link>
                }
            >
                {newsSummaries &&
                    <List
                        itemLayout="horizontal"
                        dataSource={newsSummaries}
                        renderItem={item => (
                            <Tooltip placement="right" title={item.title}>
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
                                                <Link className="link-ellipsis" href={`/articles/${item.id}`}>{item.title}</Link>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            </Tooltip>
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