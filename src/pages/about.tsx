import { PageHeader } from "@/components/page-header";
import MarkdownRenderer from "@/components/markdown-renderer";
import Head from "next/head";

const AboutPage = () => {
  return (
    <>
        <Head>
            <title>关于我们 - 上海交通大学绿色爱心屋</title>
        </Head>
        <PageHeader title="关于我们" onBack/>
        <div className="container article-content">
            <MarkdownRenderer content={null}/>
            {/* TODO:获取文章接口实现 */}
        </div>
    </>
  );
};
export default AboutPage;