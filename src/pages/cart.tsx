import Head from "next/head";
import { Col, Row, Space, Typography, Button, Affix, Grid, Spin } from "antd";
import { AxCoin } from "@/components/axcoin";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { CheckoutTableList } from "@/components/product-list";
import AuthContext from "@/contexts/auth";
import CartContext from "@/contexts/cart";
import { CheckoutDetail } from "@/models/checkout";
import {
  checkoutDeleteLine,
  checkoutFind,
  checkoutUpdateLine,
} from "@/services/checkout";
import { MessageContext } from "@/contexts/message";
import { useRouter } from "next/router";
import { CheckoutCompleteModal } from "@/components/checkout-complete-modal";
import { CheckoutCustomerData } from "@/components/checkout-customer-data";
const { Text } = Typography;
const { useBreakpoint } = Grid;

export const OrderPageView = () => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const client = authCtx.client;
  const message = useContext(MessageContext);
  const screens = useBreakpoint();
  const [checkout, setCheckout] = useState<CheckoutDetail | undefined>(
    undefined
  );
  const [top, setTop] = React.useState<number>(70);
  const [isCompleteModalOpen, setCompleteModalOpen] = useState<boolean>(false);

  function updateCheckoutAndCartNum(checkout: CheckoutDetail) {
    //cartCtx.setCheckoutId(checkout.id);
    cartCtx.setTotalQuantity(checkout.quantity);
    setCheckout(checkout);
  }

  function onClickDelete(id: string) {
    if (checkout == undefined) {
      message.error("操作失败：购物车不存在。请刷新页面重试！");
      return;
    }
    var line = checkout.lines?.find((x) => x.id == id);
    if (line == undefined) {
      message.error("操作失败：商品不存在。请刷新页面重试！");
      return;
    }
    checkoutDeleteLine(client!, checkout.id, id)
      .then((data) => updateCheckoutAndCartNum(data))
      .catch((err) => message.error(err));
  }

  function onItemNumberChange(id: string, value: number) {
    if (checkout == undefined) {
      message.error("操作失败：购物车不存在。请刷新页面重试！");
      return;
    }
    var line = checkout.lines?.find((x) => x.id == id);
    if (line == undefined) {
      message.error("操作失败：商品不存在。请刷新页面重试！");
      return;
    }
    if (value <= 0) {
      message.error("操作失败：数量必须是正整数");
      return;
    }
    checkoutUpdateLine(client!, checkout.id, id, value)
      .then((data) => updateCheckoutAndCartNum(data))
      .catch((err) => message.error(err));
  }

  //Todo: 响应用户连点操作，延迟发送请求
  function onItemNumberMinus(id: string) {
    if (checkout == undefined) {
      message.error("操作失败：购物车不存在。请刷新页面重试！");
      return;
    }
    var line = checkout.lines?.find((x) => x.id == id);
    if (line == undefined) {
      message.error("操作失败：商品不存在。请刷新页面重试！");
      return;
    }
    var value = line.quantity - 1;
    if (value <= 0) {
      message.error("操作失败：商品数量已达到最小值");
      return;
    }
    checkoutUpdateLine(client!, checkout.id, id, value)
      .then((data) => updateCheckoutAndCartNum(data))
      .catch((err) => message.error(err));
  }

  function onItemNumberPlus(id: string) {
    if (checkout == undefined) {
      message.error("操作失败：购物车不存在。请刷新页面重试！");
      return;
    }
    var line = checkout.lines?.find((x) => x.id == id);
    if (line == undefined) {
      message.error("操作失败：商品不存在。请刷新页面重试！");
      return;
    }
    var value = line.quantity + 1;
    if (
      line.varient.quantityLimit != undefined &&
      value > line.varient.quantityLimit
    ) {
      message.error("操作失败：商品数量已达到最大值");
      return;
    }
    checkoutUpdateLine(client!, checkout.id, id, value)
      .then((data) => updateCheckoutAndCartNum(data))
      .catch((err) => message.error(err));
  }

  const handleSubmitClick = () => {
    if (checkout == undefined) {
      message.error("操作失败：购物车不存在。请刷新页面重试！");
      return;
    }
    setCompleteModalOpen(true);
  };

  const handleCompleteModalClose = () => {
    setCompleteModalOpen(false);
  };

  useEffect(() => {
    if (cartCtx.checkoutId == undefined) cartCtx.doRefresh();
  });

  useEffect(() => {
    if (cartCtx.checkoutId != undefined) {
      checkoutFind(client!, cartCtx.checkoutId)
        .then((data) => updateCheckoutAndCartNum(data))
        .catch((err) => {
          message.error(err);
          cartCtx.incrCartError();
        });
    }
  }, [cartCtx.checkoutId, router]);

  if (!checkout) {
    return (
      <center>
        <Spin size="large" style={{ marginTop: "200px" }} />
      </center>
    );
  }

  if (screens.md) {
    return (
      <>
        <Head>
          <title>购物车 - 上海交通大学绿色爱心屋</title>
        </Head>
        <Row>
          <Col xs={24} sm={24} md={18}>
            <CheckoutTableList
              CheckoutLines={checkout.lines!}
              onClickDelete={onClickDelete}
              onItemNumberChange={onItemNumberChange}
              onItemNumberMinus={onItemNumberMinus}
              onItemNumberPlus={onItemNumberPlus}
            />
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Affix offsetTop={top}>
              <CheckoutCustomerData
                checkout={checkout}
                setCheckout={setCheckout}
                handleSubmitClick={handleSubmitClick}
              />
            </Affix>
          </Col>
        </Row>
        <CheckoutCompleteModal
          isopen={isCompleteModalOpen}
          checkout={checkout}
          onClose={handleCompleteModalClose}
        />
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>购物车 - 上海交通大学绿色爱心屋</title>
        </Head>
        <Row>
          <Col sm={24} xs={24}>
            <CheckoutCustomerData
              checkout={checkout}
              setCheckout={setCheckout}
              handleSubmitClick={handleSubmitClick}
            />
          </Col>
          <Col xs={24} sm={24}>
            <CheckoutTableList
              CheckoutLines={checkout.lines!}
              onClickDelete={onClickDelete}
              onItemNumberChange={onItemNumberChange}
              onItemNumberMinus={onItemNumberMinus}
              onItemNumberPlus={onItemNumberPlus}
            />
          </Col>

          <div
            style={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              background: "#fff",
              padding: "20px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              zIndex: "2",
            }}
          >
            <Space
              align="center"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Text style={{ display: "flex", alignItems: "center" }}>
                总计：{" "}
                <AxCoin value={checkout.totalPrice.gross.amount} coloredValue />
              </Text>
              <Button
                disabled={!checkout.shippingAddress}
                type="primary"
                onClick={handleSubmitClick}
              >
                提交订单
              </Button>
            </Space>
          </div>
        </Row>
        <CheckoutCompleteModal
          isopen={isCompleteModalOpen}
          checkout={checkout}
          onClose={handleCompleteModalClose}
        />
      </>
    );
  }
};

export default OrderPageView;
