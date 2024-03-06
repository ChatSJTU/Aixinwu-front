export interface OrderProductSingleProps {
    id: number;
    itemNumber: number;
}

export interface OrderFormProps {
    reciver: any;
    products: OrderProductSingle[];
    remark?: string;
}