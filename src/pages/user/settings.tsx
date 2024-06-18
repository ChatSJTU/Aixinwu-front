import Head from "next/head";
import UserLayout from "@/components/user-center-layout"
import { PageHeader } from "@/components/page-header";

const UserSettingsPage = () => {

    return (
        <>
            <Head>
                <title>偏好设置 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <PageHeader title={"偏好设置"} />
            </UserLayout>
        </>
    );
};
export default UserSettingsPage;