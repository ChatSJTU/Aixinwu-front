import { PageHeader } from "@/components/page-header";
import { LoadingSpin } from "@/components/loading-spin";
import { AxCoin } from "@/components/axcoin";
import { Space } from "antd";
import Head from "next/head";

const TestPage = () => {
  return (
    <>
        <Head>
            <title>测试页面 - 上海交通大学绿色爱心屋</title>
        </Head>
        <PageHeader title="组件测试页面" onBack/>
        <div className="container">
          <Space size="large">
            <AxCoin size={16}/>
            <AxCoin />
            <AxCoin value={10}/>
            <AxCoin value={10} originValue={100}/>
            <AxCoin value={10} originValue={100} coloredValue/>
            <AxCoin value={10} originValue={100} coloredValue style={{color: "#F57A25"}}/>
          </Space>
        </div>
    </>
  );
};
export default TestPage;