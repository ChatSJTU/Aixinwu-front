import Head from "next/head";
import { Typography, Card } from "antd";
import { PageHeader } from "@/components/page-header";
import { PreDonationForm } from "@/components/pre-donate-form";
import {ProductListCard, ProductSummaryCard} from "@/components/product-list-card"

const { Title } = Typography;

const OrderPage = () => {
    // TODO@Hua
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
                <ProductListCard id={1} cardType={"cart"} num={1} checkbox={true}/>
                <Card title="Card" size="small">
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
            </div>
        </>
    );
};
export default OrderPage;