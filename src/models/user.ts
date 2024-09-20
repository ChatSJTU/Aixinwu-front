export interface UserBasicInfo {
    name: string;
    email: string;
    type: string;
    balance: number;
    continuous_login_days: number;
}

export interface CoinLogInfo {
    id: string;
    number: string;
    balance: number;
    delta: number;
    date: string;
    type: string;
}

export interface DonationInfo {
    id: string;
    number: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    barcode: string;
    description: string;
    status: string;
    title: string;
    price: {amount: number};
}

export const UserBasicInfoMockData = {
    name: '交小苗',
    email: 'little-sjtuer@sjtu.edu.cn',
    type: 'student',
    balance: 100,
    continuous_login_days: 10,
} as UserBasicInfo;