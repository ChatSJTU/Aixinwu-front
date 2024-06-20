import React, { useContext } from 'react';
import { Table, Button, Image, Typography, Tag, Flex } from 'antd';
import type { TableColumnsType } from 'antd';
import { ExportOutlined, CalendarOutlined, PayCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { OrderInfo } from '@/models/order';
import { useRouter } from 'next/router';
import { AxCoin } from './axcoin';
import { orderPay } from '@/services/order';
import { MessageContext } from '@/contexts/message';
import AuthContext from '@/contexts/auth';

const { Text } = Typography;

interface OrderTableProps {
    orders: OrderInfo[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
    const router = useRouter();
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);

    const toOrderDetail = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };

    const handlePayClick = (orderId: string) => {
        orderPay(client!, orderId)
            .then(data => {
                message.success("支付成功");
            })
            .catch(err => {
                message.error(err);
            });
    }
    
    const dataSource = orders.map(order => ({
        key: order.id,
        orderId: order.number,
        paymentStatus: [order.paymentStatus, order.id],
        createTime: order.created.split('T')[0],
        totalCost: order.total.gross.amount,
        orderStatus: order.isPaid,
        productName: order.lines.length > 1 ? `${order.lines[0].productName}...等${order.lines.length}件商品` : order.lines[0].productName,
        imageUrl: order.lines[0].variant.media[0]?.url ?? order.lines[0].thumbnail?.url, // 只取第一个产品的第一个图片
    }));

    const columns: TableColumnsType<any> = [
        {
            title: '订单编号',
            align: 'center',
            dataIndex: 'orderId',
            key: 'orderId',
            width: '12%',
            render: (_, record: OrderInfo) => <Text strong style={{ fontSize: '18px' }}>{record.number}</Text>
        },
        {
            title: '商品图片',
            align: 'center',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (_, record: OrderInfo) => <Image src={record.lines[0].variant.media[0]?.url ?? record.lines[0].thumbnail?.url} preview={false} />,
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'productName',
            key: 'productName',
            render: (_, record: OrderInfo) => <Text strong style={{ fontSize: '18px' }}>{record.lines.length > 1 ? `${record.lines[0].productName}...等${record.lines.length}件商品` : record.lines[0].productName}</Text>
        },
        {
            title: '下单时间',
            align: 'center',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (_, record: OrderInfo) => <Text style={{ fontSize: '16px' }}><CalendarOutlined style={{ marginRight: '4px' }} />{record.created.split('T')[0]}</Text>
        },
        {
            title: '总价',
            align: 'center',
            dataIndex: 'totalCost',
            key: 'totalCost',
            render: (_, record: OrderInfo) => <AxCoin value={record.total.gross.amount} size={20} coloredValue></AxCoin>
        },
        {
            title: '状态',
            align: 'center',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (_, record: OrderInfo) => (
                record.paymentStatus === "FULLY_CHARGED" ? <Tag style={{ marginInlineEnd: '0px' }} color='green'>已支付</Tag>
                    :
                    record.paymentStatus === "NOT_CHARGED" ? <Tag style={{ marginInlineEnd: '0px' }} color='blue'>未支付</Tag>
                        :
                        record.paymentStatus === "FULLY_REFUNDED" ? <Tag style={{ marginInlineEnd: '0px' }} color='purple'>已退款</Tag>
                            :
                            <Tag style={{ marginInlineEnd: '0px' }}>已取消</Tag>
            )
        },
        {
            title: '操作',
            width: '12%',
            align: 'center',
            key: 'operation',
            render: (_, record: OrderInfo) => {

                if (record.paymentStatus === "NOT_CHARGED") {
                    return (
                        <Flex vertical justify='center' align='center' >
                            <Button type='primary' size='small' icon={<PayCircleOutlined />} style={{ marginBottom: '10px' }} onClick={() => {handlePayClick(record.id);}}>支付</Button>
                            <Button type='default' size='small' icon={<CloseCircleOutlined />} >取消</Button>
                        </Flex>
                    )
                }
                else {
                    return (
                        <Button type='default' size='small' icon={<ExportOutlined />} onClick={() => toOrderDetail(record.id)}>详情</Button>
                    )
                }

            },
        },
    ];
    return <Table dataSource={orders} columns={columns} pagination={{ hideOnSinglePage: true, pageSize: 4 }} />;
};
