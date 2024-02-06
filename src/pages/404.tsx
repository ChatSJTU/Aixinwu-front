import { Result, Button } from "antd";
import Head from "next/head";
import Link from "next/link";


const NotFoundPage = () => {
  return (
    <>
        <Head>
            <title>404 - 上海交通大学绿色爱心屋</title>
        </Head>
        <Result
            status="404"
            title="404"
            subTitle="抱歉，页面走丢了"
            extra={
                <Link href="/">
                    <Button type="primary">返回主页</Button>
                </Link>}
        />
    </>
  );
};
export default NotFoundPage;