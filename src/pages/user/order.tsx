import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import UserLayout from "@/components/user-center-layout"
import { PageHeader } from "@/components/page-header";

import AuthContext from "@/contexts/auth";
import { MessageContext } from '@/contexts/message';
import { fetchUserOrders } from "@/services/user";
import { OrderTable } from "@/components/order-table";
import { OrderInfo } from "@/models/order";


const UserOrderPage = () => {
    const [userOrders, setUserOrders] = useState<OrderInfo[]>([]);
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;

    useEffect(()=>{
        fetchUserOrders(client!,20)
            .then(res => setUserOrders(res))
            .catch(err => message.error(err))
    },[])

    return (
        <>
            <Head>
                <title>我的订单 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <PageHeader title={"我的订单"} />
                <div style={{marginTop: '14px'}}>
                    <OrderTable orders={userOrders}/>
                </div>
            </UserLayout>
        </>
    );
};
export default UserOrderPage;