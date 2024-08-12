import React, { useContext } from 'react';
import { Table, Button, Image, Typography, Tag, Flex, Alert } from 'antd';
import type { TableColumnsType } from 'antd';
import { ExportOutlined, CalendarOutlined, PayCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { LineItem } from '@/models/order';
import { useRouter } from 'next/router';
import { AxCoin } from './axcoin';
import { orderPay } from '@/services/order';
import { MessageContext } from '@/contexts/message';
import AuthContext from '@/contexts/auth';

const { Text } = Typography;

interface OrderLinesTableProps {
    lines: LineItem[];
    canceled: boolean;
}

export const OrderLinesTable: React.FC<OrderLinesTableProps> = ({ lines, canceled }) => {
    const router = useRouter();
    const authCtx = useContext(AuthContext);
    const client = authCtx.client;
    const message = useContext(MessageContext);

    const toProductDetail = (productSlug: string) => {
        router.push(`/product/single/${productSlug}`);
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

    const columns: TableColumnsType<any> = [
        {
            title: '',
            align: 'left',
            key: 'image',
            width: '10%',
            render: (_, record: LineItem) => (
                <Image width={48} height={48}  src={record.thumbnail?.url} preview={false}/>
            )
        },
        {
            title: '商品',
            align: 'left',
            key: 'product',
            dataIndex: 'productName',
            ellipsis: true,
            // render: (_, record: LineItem) => (
            //     <Flex align='center'>
            //         <Image width={48} height={48}  src={record.thumbnail.url} preview={false}/>
            //         <Text strong style={{ fontSize: '14px', marginLeft: "4px", textOverflow: "ellipsis" }}>
            //             {record.productName}666666666666666
            //         </Text>    
            //     </Flex>
            // )
        },
        {
            title: '分类',
            align: 'left',
            width: '20%',
            key: 'varient',
            render: (_, record: LineItem) => (
                record.variant?.name ?? <Alert message="商品不存在或已下架" type="error" />
            )
        },
        {
            title: '数量',
            align: 'left',
            width: '12%',
            key: 'number',
            render: (_, record: LineItem) => (
                record.quantity
            )
        },
        {
            title: '总价',
            align: 'left',
            width: '12%',
            key: 'totalCost',
            render: (_, record: LineItem) => (
                <AxCoin value={record.totalPrice.gross.amount} size={20} coloredValue></AxCoin>
            )
        },
        {
            title: '状态',
            align: 'left',
            width: '16%',
            key: 'status',
            render: (_, record: LineItem) => {
                if (canceled)
                    return (
                        <Tag color="error" style={{
                            fontSize: "14px", 
                            lineHeight: "auto",
                        }}>
                           已取消
                        </Tag>
                    );
                if (record.quantityFulfilled == 0)
                    return (
                        <Tag color="error" style={{
                            fontSize: "14px", 
                            lineHeight: "auto",
                        }}>
                           未收货
                        </Tag>
                    );
                if (record.quantityToFulfill == 0)
                    return (
                        <Tag color="success" style={{
                            fontSize: "14px", 
                            lineHeight: "auto",
                        }}>
                           已收货
                        </Tag>
                    );
                return (
                    <Tag color="cyan" style={{
                        fontSize: "14px", 
                        lineHeight: "auto",
                    }}>
                       部分收货
                    </Tag>
                );
            }
        },
    ];
    return <Table 
                dataSource={lines} 
                columns={columns} 
                scroll={{ x: 'max-content' }}
                pagination={{ hideOnSinglePage: true, pageSize: 10 }} 
                rowKey="id"/>;
};
