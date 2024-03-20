import exp from "node:constants";

export interface OrderProductName {
    product_name: string,
    detailed_product_name: string,
}
export interface OrderProduct {
    id: number,
    itemNumber: number,
    image_url: string[],
    product: OrderProductName,
    cost: number
    stock: number
    subtotal: number
}


export interface OrderProductSingleProps {
    id: number;
    itemNumber: number;
}

export interface OrderFormProps {
    reciver: any;
    products: OrderProductSingleProps[];
    remark?: string;
}

export interface OrderListProductsProps {
    OrderListProducts: OrderProduct[];
    onClickDelete: Function;
    onItemNumberChange: Function;
    onItemNumberMinus: Function;
    onItemNumberPlus: Function;
}