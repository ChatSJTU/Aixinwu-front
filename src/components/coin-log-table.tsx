import React from 'react';
import { Table, Button, Image, Typography, Tag, Flex } from 'antd';
import type { TableColumnsType } from 'antd';
import { CoinLogInfo } from '@/models/user';
import { CalendarOutlined } from '@ant-design/icons'
import { AxCoin } from './axcoin';

const { Text } = Typography;

interface CoinLogTableProps {
    coinLogs: CoinLogInfo[];
}

export const CoinLogTable: React.FC<CoinLogTableProps> = ({ coinLogs }) => {

    const dataSource = coinLogs.map(coinLog => ({
        key: coinLog.id,
        logId: coinLog.number,
        amount: coinLog.amount,
        createTime: coinLog.created.split('T')[0],
        description: coinLog.description,
    }));

    const columns: TableColumnsType<any> = [
        {
            title: '记录编号',
            align: 'center',
            dataIndex: 'logId',
            key: 'logId',
            width: '15%',
            render: (ID) => <Text strong style={{ fontSize: '18px' }}>{ID}</Text>
        },
        {
            title: '时间',
            align: 'center',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '20%',
            render: (date) => <Text style={{ fontSize: '16px' }}><CalendarOutlined style={{ marginRight: '4px' }} />{date}</Text>
        },
        {
            title: <><AxCoin size={14}/>&nbsp;爱心币</>,
            align: 'center',
            dataIndex: 'amount',
            key: 'amount',
            width: '15%',
            render: (amount: string) => <Text strong style={{ fontSize: '18px' }}>{amount}</Text>
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => <Text style={{ fontSize: '16px' }}>{description}</Text>
        },
    ];
    return <Table dataSource={dataSource} columns={columns} pagination={{ hideOnSinglePage: true, pageSize: 4 }} />;
};
