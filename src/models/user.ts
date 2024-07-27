export interface UserBasicInfo {
    name: string;
    email: string;
    type: string;
    balance: number;
    continuous_login_days: number;
}

export interface CoinLogInfo {
    id: string;
    number: number;
    amount: number;
    created: string;
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