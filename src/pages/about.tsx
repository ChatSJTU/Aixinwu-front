import dynamic from "next/dynamic";
import { PageHeader } from "@/components/page-header";
import Head from "next/head";

const QuillRenderer = dynamic(
  () => import("@/components/quill-renderer").then(mod => mod.default),
  { ssr: false }
);

const AboutPage = () => {
  return (
    <>
        <Head>
            <title>关于我们 - 上海交通大学绿色爱心屋</title>
        </Head>
        <PageHeader title="关于我们" onBack/>
        <div className="container article-content">
            <QuillRenderer HTMLContent={'About'}/>
            {/* TODO:获取文章接口实现 */}
        </div>
    </>
  );
};
export default AboutPage;