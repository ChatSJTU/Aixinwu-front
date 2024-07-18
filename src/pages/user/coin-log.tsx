import React, { useContext, useEffect, useState } from 'react';
import Head from "next/head";
import UserLayout from "@/components/user-center-layout"
import { PageHeader } from "@/components/page-header";
import { CoinLogTable } from "@/components/coin-log-table";
import { CoinLogInfo } from '@/models/user';
import { fetchUserBalanceEvents } from '@/services/user';
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { PaginationProps } from 'antd';

const UserCoinLogPage = () => {
    const pageSize = 4;
    const [coinLogs, setCoinLogs] = useState<CoinLogInfo[]>([]);
    const [shownPage, setShownPage] = useState<number>(1);
    const [totalResultsCount, setTotalResultsCount] = useState<number>(0);
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;

    const handleFetchLog = (page: number) => {
        if (authCtx.userInfo && authCtx.userInfo.email) {
            fetchUserBalanceEvents(client!, pageSize * page, pageSize, authCtx.userInfo.email.split('@')[0])
                .then(res => {
                    setCoinLogs(res.coinLogs);
                    setTotalResultsCount(res.totalCount)
                })
                .catch(err => message.error(err));
        }
    }

    const handlePageinationChange: PaginationProps['onChange'] = (page: number) => {
        setShownPage(page);
        handleFetchLog(page);
    };

    useEffect(() => {
        handleFetchLog(shownPage);
    }, [authCtx])

    return (
        <>
            <Head>
                <title>爱心币明细 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <PageHeader title={"爱心币明细"} />
                <div style={{ marginTop: '14px' }}>
                    <CoinLogTable
                        current={shownPage}
                        total={totalResultsCount}
                        onChange={handlePageinationChange}
                        pageSize={pageSize}
                        coinLogs={coinLogs}
                    />
                </div>
            </UserLayout>
        </>
    );
};
export default UserCoinLogPage;