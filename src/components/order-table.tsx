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
        router.push(`/order/detail?id=${orderId}`)
    }

    const handlePayClick = (orderId: string) => {
        router.push(`/order/detail?id=${orderId}&autopay=true`)
    }
    
    const columns: TableColumnsType<any> = [
        {
            title: '订单序号',
            align: 'center',
            dataIndex: 'orderId',
            key: 'orderId',
            width: '12%',
            render: (_, record: OrderInfo) => (
                <a href={`/order/detail?id=${record.id}`}>
                    <Text style={{ fontSize: '16px' }}>{record.number}</Text>
                </a>
            )
        },
        {
            title: '商品图片',
            align: 'center',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (_, record: OrderInfo) => (
                <a href={`/order/detail?id=${record.id}`}>
                    <Image src={record.lines[0]?.variant?.media[0]?.url ?? record.lines[0]?.thumbnail?.url} preview={false} />
                </a>
            ),
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'productName',
            key: 'productName',
            render: (_, record: OrderInfo) => (
                <a href={`/order/detail?id=${record.id}`}>
                    <Text style={{ fontSize: '16px' }}>
                        {record.lines.length > 1 ? `${record.lines[0].productName}...等${record.lines.length}件商品` : record.lines[0].productName}
                    </Text>
                </a>
            )
        },
        {
            title: '下单时间',
            align: 'center',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (_, record: OrderInfo) => (
                <Text style={{ fontSize: '16px' }}>
                    <CalendarOutlined style={{ marginRight: '4px' }} />
                    {record.created.split('T')[0]}
                </Text>
            )
        },
        {
            title: '总价',
            align: 'center',
            dataIndex: 'totalCost',
            key: 'totalCost',
            render: (_, record: OrderInfo) => (
                <AxCoin value={record.total.gross.amount} size={20} coloredValue></AxCoin>
            )
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
    return (
      <Table 
        dataSource={orders} 
        columns={columns} 
        pagination={{ hideOnSinglePage: true, pageSize: 10 }}
        scroll={{ x: 'max-content'}}
      />
    );
};
