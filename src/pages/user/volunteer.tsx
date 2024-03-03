import Head from "next/head";
import UserLayout from "@/components/user-center-layout"


const UserVolunteerPage = () => {

    return (
        <>
            <Head>
                <title>义工记录 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <>义工记录</>
            </UserLayout>
        </>
    );
};
export default UserVolunteerPage;