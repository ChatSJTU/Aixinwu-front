import Head from "next/head";
import HomeBanner from "./components/home-banner";
import { useEffect } from "react";

export default function HomePage() {
    useEffect(() => {
        if(localStorage.getItem('currentTheme') === null){
            localStorage.setItem('currentTheme', 'light');
        }
        const currentTheme = localStorage.getItem('currentTheme');
        if (currentTheme !== null) {
            document.documentElement.setAttribute('data-theme', currentTheme);
        }
    },[])

    return (
        <>
        <Head>
            <title>测试页面 - 上海交通大学绿色爱心屋</title>
        </Head>
        <HomeBanner/>
        </>
    );
}