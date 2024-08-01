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
        {screens.md ? <HomeBanner/> : <HomeBannerMobile/>}
        {screens.md &&
          <Row>
            <Col span={6}>
                <HomeLeftContent/>
            </Col>
            <Col span={18}>
                <HomeRightContent/>
            </Col>
        </Row>
        }
        {!screens.md &&
          <>
            <HomeRightContent/>
          </>
        }
        </>
    );
}