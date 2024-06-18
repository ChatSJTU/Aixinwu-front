export interface UserBasicInfo {
    name: string;
    email: string;
    type: string;
    balance: number;
    continuous_login_days: number;
}

export interface CoinLogInfo {
    id: string;
    number: string
    amount: number;
    created: string;
    description: string;
}