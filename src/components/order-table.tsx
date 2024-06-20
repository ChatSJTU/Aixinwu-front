import React from 'react';
import { Table, Button, Image, Typography, Tag, Flex } from 'antd';
import type { TableColumnsType } from 'antd';
import { ExportOutlined, CalendarOutlined, PayCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { OrderInfo } from '@/models/order';
import { useRouter } from 'next/router';
import { AxCoin } from './axcoin';

const { Text } = Typography;

interface OrderTableProps {
    orders: OrderInfo[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
    const router = useRouter();

    const toOrderDetail = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };
    
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
            render: (ID) => <Text strong style={{ fontSize: '18px' }}>{ID}</Text>
        },
        {
            title: '商品图片',
            align: 'center',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl: string) => <Image src={imageUrl} preview={false} />,
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'productName',
            key: 'productName',
            render: (productName: string) => <Text strong style={{ fontSize: '18px' }}>{productName}</Text>
        },
        {
            title: '下单时间',
            align: 'center',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (date) => <Text style={{ fontSize: '16px' }}><CalendarOutlined style={{ marginRight: '4px' }} />{date}</Text>
        },
        {
            title: '总价',
            align: 'center',
            dataIndex: 'totalCost',
            key: 'totalCost',
            render: (cost) => <AxCoin value={cost} size={20} coloredValue></AxCoin>
        },
        {
            title: '状态',
            align: 'center',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (stat: string) => (
                stat[0] === "FULLY_CHARGED" ? <Tag style={{ marginInlineEnd: '0px' }} color='green'>已支付</Tag>
                    :
                    stat[0] === "NOT_CHARGED" ? <Tag style={{ marginInlineEnd: '0px' }} color='blue'>未支付</Tag>
                        :
                        stat[0] === "FULLY_REFUNDED" ? <Tag style={{ marginInlineEnd: '0px' }} color='purple'>已退款</Tag>
                            :
                            <Tag style={{ marginInlineEnd: '0px' }}>已取消</Tag>
            )
        },
        {
            title: '操作',
            width: '12%',
            align: 'center',
            key: 'operation',
            dataIndex: 'paymentStatus',
            render: (record) => {

                if (record[0] === "NOT_CHARGED") {
                    return (
                        <Flex vertical justify='center' align='center' >
                            <Button type='primary' size='small' icon={<PayCircleOutlined />} style={{ marginBottom: '10px' }}>支付</Button>
                            <Button type='default' size='small' icon={<CloseCircleOutlined />} >取消</Button>
                        </Flex>
                    )
                }
                else {
                    return (
                        <Button type='default' size='small' icon={<ExportOutlined />} onClick={() => toOrderDetail(record[1])}>详情</Button>
                    )
                }

            },
        },
    ];
    return <Table dataSource={dataSource} columns={columns} pagination={{ hideOnSinglePage: true, pageSize: 4 }} />;
};
