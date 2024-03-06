import { Typography } from "antd";
import ProductGrid from "@/components/product-grid";
import { ProductSummaryExampleList } from "@/models/products";

const { Title } = Typography;

export const HomeRightContent = () => {
    return (
        <>
            <div className="container basic-card">
                <Title level={5}>热门置换</Title>
                <ProductGrid products={[...ProductSummaryExampleList, ...ProductSummaryExampleList, ...ProductSummaryExampleList]} />
            </div>
            <div className="container basic-card">
                <Title level={5}>租赁专区</Title>
            </div>
        </>
    )
}