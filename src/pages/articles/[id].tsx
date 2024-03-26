import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from 'react';
import { Breadcrumb, Button, Divider, Skeleton, Space, Typography } from "antd";
import { CalendarOutlined, EyeOutlined, UserOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons"


import MarkdownRenderer from "@/components/markdown-renderer";
import { ArticleDetails } from "@/models/article";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { fetchArticlesById } from "@/services/article";

const { Title } = Typography

const ArticlePage = () => {
    const router = useRouter();
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;
    const { id } = router.query;
    const [articleDetails, setArticleDetails] = useState<ArticleDetails | null>(null);

    useEffect(() => {
        if (typeof id === 'string') {
            fetchArticlesById(client!, id)
                .then(res => setArticleDetails(res))
                .catch(err => message.error(err));
        }
    }, [id])

    return (
        <>
            <Head>
                <title>{`${articleDetails ? articleDetails.title : '加载中'} - 上海交通大学绿色爱心屋`}</title>
            </Head>
            {articleDetails &&
                <>
                    <Breadcrumb style={{ margin: "4px 12px 4px 12px" }}
                        items={[
                            { title: <Link href="/">首页</Link> },
                            { title: <Link href={`/articles`}>{articleDetails.navigation.name}</Link> },
                            { title: <a>正文</a> }
                        ]} />
                    <div className="container article-content">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Title level={3}>{articleDetails?.title}</Title>
                            <div style={{ textAlign: "center" }} className="secondary-text">
                                <UserOutlined /> {articleDetails.author}&nbsp;&nbsp;&nbsp;
                                <CalendarOutlined /> {new Date(articleDetails.publish_time).toISOString().split('T')[0]}&nbsp;&nbsp;&nbsp;
                                <EyeOutlined /> {articleDetails.reads_count}
                            </div>
                        </Space>
                        <Divider />
                        <MarkdownRenderer content={articleDetails?.content} />
                        {(articleDetails.next || articleDetails.previous) &&
                            <>
                                <Divider />
                                <div className="article-footer">
                                    {articleDetails.next ?
                                        <Link href={`/articles/${articleDetails.next.id}`}>
                                            <LeftOutlined className="secondary-text" />
                                            <Button type="link">
                                                {articleDetails.next.title}
                                            </Button>
                                        </Link>
                                        : <div></div>}
                                    {articleDetails.previous &&
                                        <Link href={`/articles/${articleDetails.previous.id}`}>
                                            <Button type="link">
                                                {articleDetails.previous.title}
                                            </Button>
                                            <RightOutlined className="secondary-text" />
                                        </Link>
                                    }
                                </div>
                            </>
                        }
                    </div>
                </>
            }
            {!articleDetails &&
                <div className="container" style={{ textAlign: "center" }}>
                    <Skeleton.Input active />
                    <Divider />
                    <Skeleton title={false} paragraph={{ rows: 4 }} active />
                </div>
            }
        </>
    );
};
export default ArticlePage;