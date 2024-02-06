import Head from "next/head";
import HomeBanner from "./components/home-banner";
  
export default function HomePage() {
    return (
        <>
        <Head>
            <title>测试页面 - 上海交通大学绿色爱心屋</title>
        </Head>
        <HomeBanner/>
        </>
    );
}