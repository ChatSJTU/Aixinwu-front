import React from 'react';
import { Table, Typography, Tag } from 'antd';
import type { PaginationProps, TableColumnsType } from 'antd';
import { DonationInfo } from '@/models/user';
import { CalendarOutlined } from '@ant-design/icons'
import { AxCoin } from './axcoin';

const { Text } = Typography;

interface DonationTableProps {
    current: number,
    pageSize: number,
    total: number,
    onChange: PaginationProps['onChange'],
    donations: DonationInfo[];
}

export const DonationTable: React.FC<DonationTableProps> = ({ current, pageSize, total, onChange, donations }) => {

    const statusMap: any = {
        "unreviewd": ["未审批", "blue"],
        "completed": ["已完成", "green"],
        "rejected": ["被退回", "red"],
    }

    const dataSource = donations.map(donation => ({
        key: donation.number,
        number: donation.number,
        quantity: donation.quantity,
        price: donation.price.amount,
        title: donation.title,
        createdAt: donation.createdAt.split('T')[0],
        status: statusMap[donation.status] || ["未知状态", ""],
    }));

    const columns: TableColumnsType<any> = [
        {
            title: '记录编号',
            align: 'center',
            dataIndex: 'number',
            key: 'number',
            width: '14%',
            render: (ID: string) => <Text style={{ fontSize: '16px' }}>{ID}</Text>
        },
        {
            title: '标题',
            align: 'center',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            render: (title: string) => <Text strong style={{ fontSize: '16px' }}>{title}</Text>
        },
        {
            title: '时间',
            align: 'center',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '16%',
            render: (date: string) => <Text style={{ fontSize: '16px' }}><CalendarOutlined style={{ marginRight: '4px' }} />{date}</Text>
        },
        {
            title: '数量(件)',
            align: 'center',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '14%',
            render: (quantity: number) => <Text style={{ fontSize: '16px' }}>{quantity}</Text>
        },
        {
            title: <><AxCoin size={14} />&nbsp;价值(爱心币)</>,
            align: 'center',
            dataIndex: 'price',
            key: 'price',
            width: '18%',
            render: (price: number) => <AxCoin value={Number(price)} size={18} coloredValue></AxCoin>
        },
        {
            title: '状态',
            align: 'center',
            dataIndex: 'status',
            key: 'status',
            render: (status: string[]) => <Tag color={status[1]} style={{ fontSize: '14px' }}>{status[0]}</Tag>
        },
    ];
    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
                hideOnSinglePage: true,
                current: current,
                pageSize: pageSize,
                total: total,
                onChange: onChange,
            }} />
    );
};
