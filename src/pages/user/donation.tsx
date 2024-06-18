import Head from "next/head";
import UserLayout from "@/components/user-center-layout"
import { PageHeader } from "@/components/page-header";

const UserDonationPage = () => {

    return (
        <>
            <Head>
                <title>我的捐赠 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <PageHeader title={"我的捐赠"} />
            </UserLayout>
        </>
    );
};
export default UserDonationPage;