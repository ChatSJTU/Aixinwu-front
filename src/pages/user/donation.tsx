import Head from "next/head";
import UserLayout from "@/components/user-center-layout"
import { PageHeader } from "@/components/page-header";
import { DonationTable } from "@/components/donation-table";
import { DonationInfo } from "@/models/user";
import { useContext, useEffect, useState } from "react";
import AuthContext from "@/contexts/auth";
import { MessageContext } from "@/contexts/message";
import { fetchUserDonations } from "@/services/user";
import { PaginationProps } from "antd";

const UserDonationPage = () => {
    const pageSize = 8;
    const [donations, setDonations] = useState<DonationInfo[]>([]);
    const [shownPage, setShownPage] = useState<number>(1);
    const [totalResultsCount, setTotalResultsCount] = useState<number>(0);
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;

    const handleFetchLog = (page: number) => {
        if (authCtx.userInfo && authCtx.userInfo.email) {
            fetchUserDonations(client!, pageSize * page, pageSize)
                .then(res => {
                    setDonations(res.donations);
                    setTotalResultsCount(res.totalCount)
                })
                .catch(err => message.error(err));
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
                <title>我的捐赠 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <PageHeader title={"我的捐赠"} />
                <div style={{ marginTop: '14px' }}>
                    <DonationTable
                        current={shownPage}
                        total={totalResultsCount}
                        onChange={handlePaginationChange}
                        pageSize={pageSize}
                        donations={donations}
                    />
                </div>
            </UserLayout>
        </>
    );
};
export default UserDonationPage;