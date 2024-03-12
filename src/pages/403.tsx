import { Result, Button } from "antd";
import Head from "next/head";
import Link from "next/link";


const NotAuthorizedPage = () => {
  return (
    <>
        <Head>
            <title>403 - 上海交通大学绿色爱心屋</title>
        </Head>
        <Result
            status="403"
            title="403"
            subTitle="请先登录"
            extra={
                <Link href="/">
                    <Button type="primary">返回主页</Button>
                </Link>}
        />
    </>
  );
};
export default NotAuthorizedPage;