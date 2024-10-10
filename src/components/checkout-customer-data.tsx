import AuthContext from "@/contexts/auth";
import CartContext from "@/contexts/cart";
import { MessageContext } from "@/contexts/message";
import { NotificationContext } from "@/contexts/notification";
import { AddressInfo } from "@/models/address";
import { CheckoutDetail } from "@/models/checkout";
import {
  Button,
  Collapse,
  Dropdown,
  Flex,
  Grid,
  Input,
  Menu,
  Space,
  Typography,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AxCoin } from "./axcoin";
import { fetchUserAddresses } from "@/services/user";
import { checkoutAddressUpdate, checkoutUpdateNote } from "@/services/checkout";
const { Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;

interface CheckoutCustomerDataProps {
  checkout: CheckoutDetail;
  handleSubmitClick: () => void;
  setCheckout: (data: CheckoutDetail) => void;
}

export const CheckoutCustomerData: React.FC<CheckoutCustomerDataProps> = ({
  checkout,
  handleSubmitClick,
  setCheckout,
}) => {
  const router = useRouter();
  const authCtx = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const client = authCtx.client;
  const message = useContext(MessageContext);
  const notification = useContext(NotificationContext);
  const screens = useBreakpoint();

  const [selectedAddress, setSelectedAddress] = useState<
    AddressInfo | undefined
  >(undefined);
  const [addresses, setAddresses] = useState<AddressInfo[]>([]);
  const [customerNote, setCustomerNote] = useState<string>(checkout.note ?? "");

  function updateSelectedAddress(addr: AddressInfo) {
    if (checkout == undefined) {
      return;
    }
    checkoutAddressUpdate(client!, checkout.id, addr)
      .then((data) => {
        setSelectedAddress(addr);
        setCheckout(data);
      })
      .catch((err) => message.error(err));
  }

  const handleAddressClick = (addr: AddressInfo) => {
    updateSelectedAddress(addr);
  };

  const updateCustomerNote = () => {
    checkoutUpdateNote(client!, checkout.id, customerNote)
      .then((data) => {})
      .catch((err) => message.error(err));
  };

  useEffect(() => {
    if (!authCtx.isLoggedIn) router.push("/403");
    fetchUserAddresses(client!)
      .then((data) => {
        setAddresses(data);
        if (data.length == 0) {
          const key = `open${Date.now()}`;
          const btn = (
            <Button
              type="primary"
              size="middle"
              onClick={() => {
                notification.destroy(key);
                router.push("/user/consignee");
              }}
            >
              前往收货地址管理
            </Button>
          );
          notification.warning({
            message: "未找到收货地址",
            description: "您必须至少添加一个收货地址才能下单商品。",
            btn,
            key,
          });
        }
      })
      .catch((err) => message.error(err));
  }, [cartCtx.checkoutId, router]);

  useEffect(() => {
    if (!addresses || addresses.length == 0) return;
    if (checkout == undefined || !checkout.isShippingRequired) return;
    if (selectedAddress == undefined) {
      if (checkout?.shippingAddress == undefined) {
        updateSelectedAddress(
          addresses.find((x) => x.isDefaultShippingAddress)!
        );
      } else {
        setSelectedAddress(checkout?.shippingAddress);
      }
    }
  }, [checkout, addresses]);

  const menu = (
    <Menu style={{ maxHeight: "220px", maxWidth: "200px", overflowY: "auto" }}>
      {addresses.map((address, index) => (
        <Menu.Item key={index} onClick={() => handleAddressClick(address)}>
          <p style={{ maxHeight: "300px", overflow: "auto" }}>
            <Space>
              <span>{address.firstName}</span>
              <span>{address.phone}</span>
            </Space>
            <br />
            <span
              style={{
                fontSize: "12px",
                color: "#888",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {address.streetAddress1}
            </span>
          </p>
        </Menu.Item>
      ))}
    </Menu>
  );

  return screens.md ? (
    <div className={"container"}>
      <div>
        <Collapse
          defaultActiveKey={["1", "2"]}
          style={{ marginBottom: "13px" }}
          ghost
          size="small"
        >
          <Panel
            header="收货人信息"
            key="1"
            style={{
              maxHeight: "300px",
              textOverflow: "ellipsis",
              fontWeight: "bold",
            }}
          >
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button
                type="text"
                style={{
                  width: "100%",
                  fontWeight: "lighter",
                  height: "auto",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Flex justify="space-between" style={{ width: "100%" }}>
                  <Space
                    direction="vertical"
                    size="small"
                    style={{
                      textAlign: "left",
                      width: "100%",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selectedAddress ? (
                      <>
                        <Space style={{ flexWrap: "wrap" }}>
                          <span>{selectedAddress.firstName}</span>
                          <span>{selectedAddress.phone}</span>
                        </Space>
                      </>
                    ) : (
                      <>
                        <span>{"请选择地址"}</span>
                      </>
                    )}
                    {selectedAddress && (
                      <Paragraph
                        style={{
                          fontSize: "12px",
                          color: "gray",
                          whiteSpace: "pre-wrap",
                          marginBottom: "4px",
                        }}
                        ellipsis={{ rows: 2, expandable: false }}
                      >
                        {selectedAddress.streetAddress1}
                      </Paragraph>
                    )}
                  </Space>
                  <EllipsisOutlined />
                </Flex>
              </Button>
            </Dropdown>
          </Panel>

          <Panel
            header="订单备注"
            key="2"
            style={{ maxHeight: "150px", fontWeight: "bold" }}
          >
            <Input.TextArea
              value={customerNote}
              onChange={(e) => {
                setCustomerNote(e.target.value);
              }}
              onBlur={updateCustomerNote}
              rows={4}
              style={{ maxHeight: "100px", overflow: "auto" }}
            />
          </Panel>
        </Collapse>
        <Space
          align="center"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Text style={{ display: "flex", alignItems: "center" }}>
            {/* 总计： <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{totalCost}</span> */}
            总计：{" "}
            <AxCoin value={checkout.totalPrice.gross.amount} coloredValue />
          </Text>
          <Button
            disabled={!selectedAddress}
            type="primary"
            onClick={handleSubmitClick}
          >
            提交订单
          </Button>
        </Space>
      </div>
    </div>
  ) : (
    <div className={"container"}>
      <div>
        <Collapse
          defaultActiveKey={["1", "2"]}
          style={{ marginBottom: "13px" }}
          ghost
          size="small"
        >
          <Panel
            header="收货人信息"
            key="1"
            style={{
              maxHeight: "300px",
              textOverflow: "ellipsis",
              fontWeight: "bold",
            }}
          >
            <Dropdown overlay={menu} trigger={["click"]}>
              {/* 点击选择更多地址 */}
              <Button
                type="text"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  fontWeight: "lighter",
                  height: "auto",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Flex justify="space-between">
                  <Space
                    direction="vertical"
                    size="small"
                    style={{
                      textAlign: "left",
                      maxWidth: "85%",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Space>
                      <span>
                        {selectedAddress
                          ? selectedAddress.firstName
                          : "请选择地址"}
                      </span>
                      <span>
                        {selectedAddress ? selectedAddress.phone : ""}
                      </span>
                    </Space>
                    {/* 地址 */}
                    <Paragraph
                      style={{
                        fontSize: "12px",
                        color: "gray",
                        whiteSpace: "pre-wrap",
                        marginBottom: "4px",
                      }}
                      ellipsis={{ rows: 2, expandable: false }}
                    >
                      {selectedAddress ? selectedAddress.streetAddress1 : ""}
                    </Paragraph>
                  </Space>
                  <EllipsisOutlined />
                </Flex>
              </Button>
            </Dropdown>
          </Panel>

          <Panel
            header="订单备注"
            key="2"
            style={{ maxHeight: "150px", fontWeight: "bold" }}
          >
            <Input.TextArea
              value={customerNote}
              onChange={(e) => {
                setCustomerNote(e.target.value);
              }}
              onBlur={updateCustomerNote}
              rows={4}
              style={{ maxHeight: "100px", overflow: "auto" }}
            />
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};
