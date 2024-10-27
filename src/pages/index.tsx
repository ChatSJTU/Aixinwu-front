import { useEffect, useContext } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import HomeBanner from "@/components/home-banner";
import HomeBannerMobile from "@/components/home-banner-mobile";
import { HomeLeftContent } from "@/components/home-left";
import { HomeRightContent } from "@/components/home-right";
import { Row, Col, Grid } from "antd";
import AuthContext from "@/contexts/auth";

export default function HomePage() {
  const screens = Grid.useBreakpoint();
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const { share_code } = router.query;
    if (share_code && typeof share_code === 'string' && share_code.trim() !== '') {
      authCtx.doExternalLogin();
    }
  }, [router.query]);

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
