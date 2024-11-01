import React from 'react';
import { Table, Button, Image, Typography, Tag, Flex } from 'antd';
import type { PaginationProps, TableColumnsType } from 'antd';
import { CoinLogInfo } from '@/models/user';
import { CalendarOutlined } from '@ant-design/icons'
import { AxCoin } from './axcoin';
import dayjs from 'dayjs'

const { Text } = Typography;

interface CoinLogTableProps {
    current: number,
    pageSize: number,
    total: number,
    onChange: PaginationProps['onChange'],
    coinLogs: CoinLogInfo[];
}

interface DescMap { [key: string]: string[]; }

export const CoinLogTable: React.FC<CoinLogTableProps> = ({ current, pageSize, total, onChange, coinLogs }) => {

    const descMap: DescMap = {
        "donation_granted": ["已获批捐赠", "geekblue"],
        "donation_rejected": ["已拒绝捐赠", "geekblue"],
        "manually_updated": ["手动更新", "purple"], 
        "first_login": ["首次登录", "magenta"],
        "consecutive_login": ["连续登录", "magenta"],
        "consumed": ["已支付", "green"],
        "refunded": ["已退款", "blue"],
        "invite_new_user": ["邀请新用户", "gold"],
        "special_event": ["特殊活动", "purple"],
        "bonus": ["特殊奖励", "purple"],
        "poor_sign": ["贫困生奖励", "cyan"],
        "other": ["其他", ""],
    }
    const dataSource = coinLogs.map(coinLog => ({
        key: coinLog.id,
        logId: coinLog.number,
        amount: coinLog.balance,
        delta: coinLog.delta,
        createTime: dayjs(coinLog.date).format("YYYY-MM-DD HH:mm:ss"),
        description: descMap[coinLog.type] || ["未知类型", ""],
    }));

    const columns: TableColumnsType<any> = [
        {
            title: '记录编号',
            align: 'center',
            dataIndex: 'logId',
            key: 'logId',
            width: '18%',
            render: (ID) => <Text style={{ fontSize: '16px' }}>{ID}</Text>
        },
        {
            title: '时间',
            align: 'center',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '240px',
            render: (date) => <Text style={{ fontSize: '16px' }}><CalendarOutlined style={{ marginRight: '4px' }} />{date}</Text>
        },
        {
            title: <><AxCoin size={14} />&nbsp;爱心币变动</>,
            align: 'center',
            dataIndex: 'delta',
            key: 'delta',
            width: '20%',
            render: (delta: string) => <AxCoin value={Number(delta)} size={18} coloredValue></AxCoin>
        },
        {
            title: <><AxCoin size={14} />&nbsp;爱心币余额</>,
            align: 'center',
            dataIndex: 'amount',
            key: 'amount',
            width: '20%',
            render: (amount: string) => <AxCoin value={Number(amount)} size={18} coloredValue></AxCoin>
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
            key: 'description',
            render: (desc: string[]) => <Tag color={desc[1]} style={{ fontSize: '14px' }}>{desc[0]}</Tag>
        },
    ];
    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: 'max-content'}}
            pagination={{
                hideOnSinglePage: true,
                current: current,
                pageSize: pageSize,
                total: total,
                onChange: onChange,
            }} />
    );
};
