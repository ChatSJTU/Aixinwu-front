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
        imageUrl: order.lines[0].variant.media[0].url, // 只取第一个产品的第一个图片
    }));

    const columns: TableColumnsType<any> = [
        {
            title: '订单编号',
            align: 'center',
            dataIndex: 'orderId',
            key: 'orderId',
            width: '8%',
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
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (stat) => stat ? <Tag color='#5BD8A6'>已支付</Tag> : <Tag color='blue'>未支付</Tag>
        },
        {
            title: '操作',
            width: '15%',
            align: 'center',
            key: 'paymentStatus',
            dataIndex: 'paymentStatus',
            render: (record) => {
                if (record[0] === "FULLY CHARGED") {
                    return (
                        <Button type='link' icon={<ExportOutlined />} onClick={() => toOrderDetail(record[1])}>详情</Button>
                    )
                }
                else if (record[0] === "NOT_CHARGED") {
                    return (
                        <Flex vertical justify='center' align='center' >
                            <Button type='primary' icon={<PayCircleOutlined />} size='small' style={{ marginBottom: '10px' }}>支付</Button>
                            <Button type='default' icon={<CloseCircleOutlined />} size='small'>取消</Button>
                        </Flex>
                    )
                }
                return <span>{record[0]}</span>
            },
        },
    ];
    return <Table dataSource={dataSource} columns={columns} pagination={{ hideOnSinglePage: true, pageSize: 4 }} />;
};
