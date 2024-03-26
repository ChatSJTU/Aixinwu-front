import { Typography } from "antd";
import ProductGrid from "@/components/product-grid";
import { ProductSummaryExampleList } from "@/models/products";
import BasicCard from "@/components/basic-card";

const { Link } = Typography;

export const HomeRightContent = () => {
    return (
        <>
            <BasicCard title="热门置换" divider
                titleExtra={
                    <Link href="/products" target="_blank">{'全部>>'}</Link>
                }
                >
                <ProductGrid products={[...ProductSummaryExampleList, ...ProductSummaryExampleList, ...ProductSummaryExampleList]} />
            </BasicCard>
            <BasicCard title="热门租赁" divider
                titleExtra={
                    <Link href="/products" target="_blank">{'全部>>'}</Link>
                }
                >
                <ProductGrid products={[...ProductSummaryExampleList, ...ProductSummaryExampleList, ...ProductSummaryExampleList]} />
            </BasicCard>
        </>
    )
}