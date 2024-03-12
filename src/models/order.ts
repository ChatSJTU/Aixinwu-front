export interface OrderProductSingleProps {
    id: number;
    itemNumber: number;
}

export interface OrderFormProps {
    reciver: any;
    products: OrderProductSingleProps[];
    remark?: string;
}