import Head from "next/head";
import { Typography } from "antd";
import { PageHeader } from "@/components/page-header";
import { PreDonationForm } from "@/components/pre-donate-form";

const { Title } = Typography;

const PreDonatePage = () => {

    return (
        <>
            <Head>
                <title>预捐赠 - 上海交通大学绿色爱心屋</title>
            </Head>
            <PageHeader title="预捐赠"/>
            <div className="container basic-card">
                <Title level={5}>发起新的</Title>
                <PreDonationForm/>
            </div>
            <div className="container basic-card">
                <Title level={5}>我的预捐赠</Title>
            </div>
        </>
    );
};
export default PreDonatePage;