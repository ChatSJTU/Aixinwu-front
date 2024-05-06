import { TableRowSelection } from "antd/es/table/interface";
import exp from "node:constants";
import { AddressInfo } from "./address";

export interface OrderProductName {
    product_name: string,
    detailed_product_name: string,
}
export interface OrderProduct {
    key: React.Key,
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
    rowSelection?: TableRowSelection<OrderProduct>;
}

interface LineItem {
    productName: string;
    variant: {
        media: {url: string;}[];
        id: string;
        pricing: {
            price: {
                gross: {
                    amount: number;
                };
            };
        };
    };
    quantity: number;
}

export interface OrderInfo {
    created: string,
    id: string,
    isPaid: boolean,
    number: string,
    paymentStatus: string,
    checkoutId: string,
    total:{
        gross:{
            amount: number,
        }
    }
    lines: LineItem[];
    shippingAddress: AddressInfo;
    totoalCOunt: number;
}