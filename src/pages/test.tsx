import { PageHeader } from "@/components/page-header";
import { LoadingSpin } from "@/components/loading-spin";
import Head from "next/head";

const TestPage = () => {
  return (
    <>
        <Head>
            <title>测试页面 - 上海交通大学绿色爱心屋</title>
        </Head>
        <PageHeader title="组件测试页面" onBack/>
        <div className="container">
            <LoadingSpin size={60} style={{color: "#cbcdd1"}} logo/>
        </div>
    </>
  );
};
export default TestPage;