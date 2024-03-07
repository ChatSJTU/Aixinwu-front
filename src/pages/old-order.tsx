import Head from "next/head";
import { Typography, Card } from "antd";
import { PageHeader } from "@/components/page-header";
import { PreDonationForm } from "@/components/pre-donate-form";
import { ProductListCard } from "@/components/product-list-card"
import { ProductList } from "@/components/product-list";
import type { ProductListProps } from "@/components/product-list"
const { Title } = Typography;

const exampleData = {
        pageIs: "cart",// "cart" or "order"
        productInfoList: [
            {
                id: 1,
                itemNumber: 1,
            },
            {
                id: 1,
                itemNumber: 2,
            },
            {
                id: 1,
                itemNumber: 3,
            },
            {
                id: 1,
                itemNumber: 4,
            },
        ]
}

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
                <ProductListCard pageIs={"cart"} productCardInfo={{id: 1, itemNumber: 1, checkbox: false}}/>
                <Card title="Card" size="small">
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
            </div>
            <div className="container basic-card">
                <Title level={5}>listTest</Title>
                <ProductList pageIs={exampleData.pageIs} productInfoList={exampleData.productInfoList}/>
            </div>
        </>
    );
};
// export default OrderPage;