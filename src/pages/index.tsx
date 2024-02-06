import Head from "next/head";
import HomeBanner from "@/components/home-banner";
import { HomeLeftContent } from "@/components/home-left";
import { HomeRightContent } from "@/components/home-right";
import { Row, Col } from "antd";
import { useEffect } from "react";

export default function HomePage() {

    return (
        <>
        <Head>
            <title>测试页面 - 上海交通大学绿色爱心屋</title>
        </Head>
        <HomeBanner/>
        <Row>
            <Col span={6}>
                <HomeLeftContent/>
            </Col>
            <Col span={18}>
                <HomeRightContent/>
            </Col>
        </Row>
        </>
    );
}