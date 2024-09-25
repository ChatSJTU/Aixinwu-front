import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import UserLayout from "@/components/user-center-layout"
import { PageHeader } from "@/components/page-header";

import AuthContext from "@/contexts/auth";
import { MessageContext } from '@/contexts/message';
import { fetchUserOrders } from "@/services/user";
import { OrderTable } from "@/components/order-table";
import { OrderInfo } from "@/models/order";
import { PaginationProps } from "antd";


const UserOrderPage = () => {
    const pageSize = 10;
    const [orders, setOrders] = useState<OrderInfo[]>([]);
    const [shownPage, setShownPage] = useState<number>(1);
    const [totalResultsCount, setTotalResultsCount] = useState<number>(0);
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;

    const handleFetchLog = (page: number) => {
        if (authCtx.isLoggedIn) {
            fetchUserOrders(client!, pageSize * page, pageSize)
                .then(res => {
                    setOrders(res.data);
                    setTotalResultsCount(res.totalCount!)
                })
                .catch(err => message.error(err))
        }
    }

    const handlePaginationChange: PaginationProps['onChange'] = (page: number) => {
        setShownPage(page);
        handleFetchLog(page);
    };

    useEffect(() => {
        handleFetchLog(shownPage);
    }, [authCtx])

    return (
        <>
            <Head>
                <title>我的订单 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <PageHeader title={"我的订单"} />
                <div style={{marginTop: '14px'}}>
                    <OrderTable 
                        orders={orders} 
                        current={shownPage}
                        total={totalResultsCount}
                        onChange={handlePaginationChange}
                        pageSize={pageSize}/>
                </div>
            </UserLayout>
        </>
    );
};
export default UserOrderPage;