import Head from "next/head";
import HomeBanner from "@/components/home-banner";
import HomeBannerMobile from "@/components/home-banner-mobile";
import { HomeLeftContent } from "@/components/home-left";
import { HomeRightContent } from "@/components/home-right";
import { Row, Col, Grid } from "antd";

export default function HomePage() {
  const screens = Grid.useBreakpoint();

  return (
    <>
      <Head>
        <title>上海交通大学绿色爱心屋</title>
      </Head>
      {screens.md ? <HomeBanner /> : <HomeBannerMobile />}
      <Row>
        <Col span={screens.md ? 6 : 0}>
          <HomeLeftContent />
        </Col>
        <Col span={screens.md ? 18 : 24}>
          <HomeRightContent />
        </Col>
      </Row>
    </>
  );
}
