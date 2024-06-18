import React, { useEffect, useState } from 'react';
import Head from "next/head";
import UserLayout from "@/components/user-center-layout"
import { PageHeader } from "@/components/page-header";
import { CoinLogTable } from "@/components/coin-log-table";
import { CoinLogInfo } from '@/models/user';

const UserCoinLogPage = () => {
    const [coinLogs, setCoinLogs] = useState<CoinLogInfo[]>([]);

    return (
        <>
            <Head>
                <title>爱心币明细 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <PageHeader title={"爱心币明细"} />
                <div style={{marginTop: '14px'}}>
                    <CoinLogTable coinLogs={coinLogs}/>
                </div>
            </UserLayout>
        </>
    );
};
export default UserCoinLogPage;