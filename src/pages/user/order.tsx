import Head from "next/head";
import UserLayout from "@/components/user-center-layout"


const UserOrderPage = () => {

    return (
        <>
            <Head>
                <title>我的订单 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <>我的订单</>
            </UserLayout>
        </>
    );
};
export default UserOrderPage;