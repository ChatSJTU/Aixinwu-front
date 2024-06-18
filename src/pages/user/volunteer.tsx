import Head from "next/head";
import UserLayout from "@/components/user-center-layout"
import { PageHeader } from "@/components/page-header";

const UserVolunteerPage = () => {

    return (
        <>
            <Head>
                <title>义工记录 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <PageHeader title={"义工记录"} />
            </UserLayout>
        </>
    );
};
export default UserVolunteerPage;