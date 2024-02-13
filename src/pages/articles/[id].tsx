import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from 'react';
import { Breadcrumb, Button, Divider, Skeleton, Space, Typography } from "antd";
import { CalendarOutlined, EyeOutlined, UserOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons"
import MarkdownRenderer from "@/components/markdown-renderer";
import { ArticleDetails } from "@/models/article";
// import { LoadingSpin } from "@/components/loading-spin";

const { Title } = Typography

const TestData : ArticleDetails = {
    "id": 1,
    "title": "Hello Markdown",
    "description": "这是一篇示例文章，在这里你可以看到常用页面元素的显示效果。",
    "author": "aixinwu",
    "content": "\r\n\r\n> 安得广厦千万间，大庇天下寒士俱欢颜！风雨不动安如山。\r\n>\r\n> > 呜呼！何时眼前突兀见此屋，吾庐独破受冻死亦足！\r\n\r\nInline code: `int a=1;`. Code block:\r\n\r\n```cpp\r\nint main(int argc , char** argv){\r\n    std::cout << \"Hello World!\\n\";\r\n    return 0;\r\n}\r\n```\r\n\r\nheader | header\r\n--------- | -------------\r\ncell 1 | cell 2\r\ncell 3 | cell 4\r\n",
    "publish_time": "2024-02-11T15:19:38.2493411+08:00",
    "navigation": [{ name: "通知公告", id: 0}, ],
    "reads_count": 114514,
    "sort": 1,
    "next": null,
    "previous": {
        "id": 3,
        "title": "02-JavaScript-正则技巧"
    },
}

const ArticlePage = () => {
    const router = useRouter();
    //TODO 效仿选课社区分离 service 和 model
    const { id } = router.query;
    const [ articleDetails, setArticleDetails ] = useState<ArticleDetails | null>(TestData);

    return (
        <>
            <Head>
                <title>{`${articleDetails ? articleDetails.title : '加载中'} - 上海交通大学绿色爱心屋`}</title>
            </Head>
            {articleDetails &&
                <>
                    <Breadcrumb style={{margin: "4px 12px 4px 12px"}}
                        items={[
                            { title: <Link href="/">首页</Link> },
                            ...articleDetails?.navigation?.map(item => ({
                                title: <Link href={`/articles/list/${item.id}`}>{item.name}</Link>
                            })) || [], 
                            { title: <a>正文</a> }
                        ]}/>
                    <div className="container article-content">
                        <Space direction="vertical" style={{width: "100%"}}>
                            <Title level={3}>{articleDetails?.title}</Title>
                            <div style={{textAlign: "center"}} className="secondary-text">
                                <UserOutlined /> {articleDetails.author}&nbsp;&nbsp;&nbsp;
                                <CalendarOutlined /> {new Date(articleDetails.publish_time).toISOString().split('T')[0]}&nbsp;&nbsp;&nbsp;
                                <EyeOutlined /> {articleDetails.reads_count}
                            </div>
                        </Space>
                        <Divider/>
                        <MarkdownRenderer content={articleDetails?.content}/>
                        {(articleDetails.next || articleDetails.previous) &&
                            <>
                                <Divider/>
                                <div className="article-footer">
                                    {articleDetails.next ?
                                        <Link href={`/articles/${articleDetails.next.id}`}>
                                            <LeftOutlined className="secondary-text"/>
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
                                            <RightOutlined className="secondary-text"/>
                                        </Link>
                                    }
                                </div>
                            </>
                        }
                    </div>
                </>
            }
            {!articleDetails &&
                <div className="container" style={{textAlign: "center"}}>
                    <Skeleton.Input active/>
                    <Divider/>
                    <Skeleton title={false} paragraph={{ rows: 4 }} active/>
                </div>
            }
        </>
    );
  };
  export default ArticlePage;