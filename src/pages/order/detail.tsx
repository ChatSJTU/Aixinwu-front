import Head from "next/head";
import { Row, Col, Typography, Skeleton, Space, Breadcrumb, Button, Grid, Flex, Tag, List, Modal } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "@/contexts/auth";
import { MessageContext } from "@/contexts/message";
import { OrderDetailedInfo } from "@/models/order";
import Link from "next/link";
import { orderDetailed, orderPay } from "@/services/order";
import {
    SettingOutlined,
    ProductOutlined,
    SendOutlined,
    InfoCircleOutlined,
    PayCircleOutlined,
    FormOutlined,
    InfoCircleFilled,
} from '@ant-design/icons';
import { OrderLinesTable } from "@/components/order-lines-table";
import { AxCoin } from "@/components/axcoin";
import useErrorMessage from "@/hooks/useErrorMessage";
import dayjs from 'dayjs'

const { confirm } = Modal;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function OrderDetailPage() {
    const router = useRouter();
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;
    const { id, autopay } = router.query;
    const { et } = useErrorMessage();
    const [orderDetail, setOrderDetail] = useState<OrderDetailedInfo | null>(null);
    const [softRefresh, setSoftRefresh] = useState<Boolean>(false);
    const [checkAutoPay, setCheckAutoPay] = useState<Boolean>(false);

    useEffect(() => {
        if (id == undefined || id == "") {
            //router.push("/404");
            return;
        }
        if (softRefresh) {
            setSoftRefresh(false);
            return;
        }
        console.log(id)
        orderDetailed(client!, id as string)
            .then((data) => {
                setOrderDetail(data);
                setCheckAutoPay(true);
            })
            .catch((err) => {message.error(err);})
    }, [id, softRefresh]);

    useEffect(() => {
        if (checkAutoPay && autopay == "true") {
            handlePayClick();
            setCheckAutoPay(false);
            router.replace(router.basePath + "?id=" + id)
        }
    }, [checkAutoPay]);

    const handlePayClick = () => {
        confirm({
            title: '支付确认',
            icon: <InfoCircleFilled />,
            content: (
                <Space size="small">
                    {'是否确认支付'}
                    <AxCoin coloredValue value={orderDetail?.total.gross.amount} valueStyle={{marginTop: "0px", marginBottom: "0px"}}/>
                </Space>
            ),
            onOk() {
                orderPay(client!, orderDetail?.id!)
                    .then(data => {
                        message.success("支付成功");
                        setSoftRefresh(true);
                    })
                    .catch(err => {
                        message.error(et(`orderPay.${err.code}`));
                    });
            },
            onCancel() {
            },
        });
    }

    const otherInfoList = useMemo(() => {
        if (orderDetail == null)
            return undefined;
        return [
            {key: "订单编号", value: orderDetail.id},
            {key: "创建时间", value: dayjs(orderDetail.created).format("YYYY-MM-DD HH:mm:ss")},
            {key: "支付时间", value: dayjs(orderDetail.payments[0].created).format("YYYY-MM-DD HH:mm:ss")},
        ]
    }, [orderDetail]);

    const payInfoList = useMemo(() => {
        if (orderDetail == null)
            return undefined;
        return [
            {key: "小计", value: orderDetail.subtotal.gross.amount},
            {key: "运费", value: orderDetail.shippingMethod.price.amount},
            {key: "总计", value: orderDetail.total.gross.amount},
            {key: "已支付", value: orderDetail.totalBalance.amount + orderDetail.total.gross.amount},
        ]
    }, [orderDetail]);

    const getOrderPaymentStateTag = function() {
        var text = "";
        var color = "";
        switch(orderDetail?.paymentStatus) {
            case "NOT_CHARGED": text = "未支付"; color = "processing"; break;
            case "PENDING": text = "支付状态未知"; color = "default"; break;
            case "PARTIALLY_CHARGED": text = "部分已支付"; color = "warning"; break;
            case "FULLY_CHARGED": text = "已支付"; color = "success"; break;
            case "PARTIALLY_REFUNDED": text = "已部分退款"; color = "purple"; break;
            case "FULLY_REFUNDED": text = "已全额退款"; color = "geekblue"; break;
            case "REFUSED": text = "支付已拒绝"; color = "error"; break;
            case "CANCELLED": text = "支付已取消"; color = "default"; break;
            default: text = "未支付"; color = "magenta"; break;
        }

        return (<Tag color={color} style={{
                        fontSize: "18px", 
                        lineHeight: "30px",
                        marginLeft: "12px"
                    }}>{
                        text
                    }</Tag>);
    };

    const OrderTopRow = () => (
        <Row>
            <Col flex="auto" >
                <Flex align="center" style={{
                    margin: "14px", 
                    marginLeft: "16px"
                }}>
                    <Text style={{
                        fontSize: "28px"
                    }}>
                        订单 #{orderDetail?.number}
                    </Text>
                    {getOrderPaymentStateTag()}
                </Flex>
            </Col>
            <Col flex="none">
                <Flex align="center" style={{
                    margin: "12px", 
                    marginRight: "16px"
                }}>
                    <Button icon={<SettingOutlined />} size="large"></Button>
                </Flex>
            </Col>
        </Row>
    );

    const OrderLinesBlock = () => (
        <div className="block-item">
            <Flex className="block-item-title" align="center" style={{marginBottom: "4px"}}>
                <ProductOutlined style={{fontSize: "20px"}} />
                <Text style={{marginTop: "4px", marginBottom: "6px", fontSize: "20px", marginLeft: "8px"}}>商品列表</Text>
            </Flex>
            <OrderLinesTable lines={orderDetail?.lines!}/>
        </div>
    );

    const OrderAddressBlock = () => (
        <div className="block-item">
            <Flex className="block-item-title" align="center" style={{marginBottom: "4px"}}>
                <SendOutlined style={{fontSize: "20px"}} />
                <Text style={{marginTop: "4px", marginBottom: "6px", fontSize: "20px", marginLeft: "8px"}}>收货地址</Text>
            </Flex>
            <Space size="small" direction="vertical">
                <Text style={{fontSize: "16px"}}><span style={{fontWeight: "bold"}}>{orderDetail?.shippingAddress.firstName} {orderDetail?.shippingAddress.lastName}</span>{' '}{orderDetail?.shippingAddress.phone}</Text>
                <Text style={{fontSize: "16px"}}>{orderDetail?.shippingAddress.countryArea}{orderDetail?.shippingAddress.city}{' '}{orderDetail?.shippingAddress.streetAddress1}</Text>
            </Space>
        </div>
    );

    const OrderNoteBlock = () => (
        <div className="block-item">
            <Flex className="block-item-title" align="center" style={{marginBottom: "4px"}}>
                <FormOutlined style={{fontSize: "20px"}} />
                <Text style={{marginTop: "4px", marginBottom: "6px", fontSize: "20px", marginLeft: "8px"}}>订单备注</Text>
            </Flex>
            <Paragraph>
                <Text>{!orderDetail?.customerNote ? "无" : orderDetail?.customerNote}</Text>
            </Paragraph>
        </div>
    );

    const OrderOtherInfoBlock = () => (
        <div className="block-item">
            <Flex className="block-item-title" align="center" style={{marginBottom: "4px"}}>
                <InfoCircleOutlined style={{fontSize: "20px"}} />
                <Text style={{marginTop: "4px", marginBottom: "6px", fontSize: "20px", marginLeft: "8px"}}>更多信息</Text>
            </Flex>
            <List
                size="small"
                itemLayout="horizontal"
                dataSource={otherInfoList}
                renderItem={(item) => (
                    <List.Item>
                        <div>{item.key}</div>
                        <div>{item.value}</div>
                    </List.Item>
                )}
                />
        </div>
    );

    const OrderPayInfoBlock = () => (
        <div className="block-item">
            <Flex className="block-item-title" align="center" style={{marginBottom: "4px"}}>
                <PayCircleOutlined style={{fontSize: "20px"}} />
                <Text style={{marginTop: "4px", marginBottom: "6px", fontSize: "20px", marginLeft: "8px"}}>支付信息</Text>
            </Flex>
            <List
                size="small"
                split={false}
                itemLayout="horizontal"
                dataSource={payInfoList}
                renderItem={(item) => (
                    <List.Item>
                        <div>{item.key}</div>
                        <AxCoin coloredValue value={item.value} valueStyle={{marginTop: "0px", marginBottom: "0px"}}/>
                    </List.Item>
                )}
                />
            { !orderDetail?.isPaid &&
                <Flex justify="flex-end" style={{marginTop: "8px"}}>
                    <Space size="small" direction="horizontal">
                        <Button>取消订单</Button>
                        <Button type="primary" onClick={handlePayClick}>立即支付</Button>
                    </Space>
                </Flex>
            }
        </div>
    );

    const LeftPanel = () => (
        <div className="container" style={{padding: "0px"}}>
            <OrderTopRow/>
            <OrderLinesBlock/>
            <OrderAddressBlock/>
            <OrderNoteBlock/>
            <OrderOtherInfoBlock/>
        </div>
    );

    const RightPanel = () => (
        <div className="container" style={{padding: "0px"}}>
            <OrderPayInfoBlock/>
        </div>
    );

    const screens = useBreakpoint();
    return (
        <>
            <Head>
                <title>订单详情 - 上海交通大学绿色爱心屋</title>
            </Head>
            <Breadcrumb style={{ margin: "4px 12px 4px 12px" }}
                        items={[
                            { title: <Link href="/">首页</Link> },
                            { title: <Link href={`/user/order`}>订单列表</Link> },
                            { title: <a>订单详情</a> }
                        ]} />
            {orderDetail &&
                <>
                    { screens.xl && (
                        <Row>
                            <Col xs={24} sm={24} md={18}>
                                <LeftPanel/>
                            </Col>
                            <Col xs={24} sm={24} md={6}>
                                <RightPanel/>
                            </Col>
                        </Row>
                    )}
                    { !screens.xl && (
                        <div>
                            <LeftPanel/>
                            <RightPanel/>
                        </div>
                    )}
                </>
            }
            {!orderDetail &&
                <div className="container" style={{ textAlign: "center" }}>
                    {/* <Skeleton.Input active />
                    <Divider /> */}
                    <Skeleton title={false} paragraph={{ rows: 4 }} active />
                </div>
            }
        </>
    );
}
