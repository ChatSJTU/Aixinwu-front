import dynamic from "next/dynamic";
import { PageHeader } from "@/components/page-header";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/contexts/auth";
import { MessageContext } from "@/contexts/message";
import { ArticleDetails } from "@/models/article";
import { fetchArticleBySlug } from "@/services/article";

const QuillRenderer = dynamic(
  () => import("@/components/quill-renderer").then(mod => mod.default),
  { ssr: false }
);

const AboutPage = () => {
    const router = useRouter();
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;
    const { id } = router.query;
    const [articleDetails, setArticleDetails] = useState<ArticleDetails | null>(null);

    useEffect(() => {
      fetchArticleBySlug(client!, "about")
        .then(res => setArticleDetails(res))
        .catch(err => message.error(err));
    }, [router])

    return (
      <>
          <Head>
              <title>关于我们 - 上海交通大学绿色爱心屋</title>
          </Head>
          <PageHeader title="关于我们" onBack/>
          <div className="container article-content">
              <QuillRenderer HTMLContent={articleDetails?.content!}/>
              {/* TODO:获取文章接口实现 */}
          </div>
      </>
    );
};
export default AboutPage;