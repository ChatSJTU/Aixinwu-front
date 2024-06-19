import { Typography } from "antd";
import React, { useState, useEffect, useContext } from "react";
import ProductGrid from "@/components/product-grid";
import { ProductSummary } from "@/models/products";
import BasicCard from "@/components/basic-card";
import AuthContext from '@/contexts/auth';
import { fetchProductsByCollection } from "@/services/product";

const { Link } = Typography;

export const HomeRightContent = () => {

    const authCtx = useContext(AuthContext);
    const client = authCtx.client;
    const [hotProducts, setHotProducts] = useState<ProductSummary[] | null>(null);

    useEffect(() => {
        fetchProductsByCollection(client!, 12, 'hot-products')
            .then(products => setHotProducts(products))
    }, [])

    return (
        <>
            <BasicCard title="热门置换" divider
                titleExtra={
                    <Link href="/products" target="_blank">{'全部>>'}</Link>
                }
                >
                <ProductGrid products={hotProducts || []} />
            </BasicCard>
            <BasicCard title="热门租赁" divider
                titleExtra={
                    <Link href="/products" target="_blank">{'全部>>'}</Link>
                }
                >
                <ProductGrid products={[]} />
            </BasicCard>
        </>
    )
}