export interface OrderProduct {
    id: number,
    itemNumber: number,
    image_url: string[],
    pruduct : {
        product_name: string,
        detailed_product_name: string
    }
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