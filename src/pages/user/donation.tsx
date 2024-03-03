import Head from "next/head";
import UserLayout from "@/components/user-center-layout"


const UserDonationPage = () => {

    return (
        <>
            <Head>
                <title>我的捐赠 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <>我的捐赠</>
            </UserLayout>
        </>
    );
};
export default UserDonationPage;