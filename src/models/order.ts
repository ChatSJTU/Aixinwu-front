import { TableRowSelection } from "antd/es/table/interface";
import exp from "node:constants";
import { AddressInfo } from "./address";
import { Money } from "./common";

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

interface LineItemThumbnail {
    url: string;
    alt?: string | null;
}
 
export interface LineItem {
    productName: string,
    totalPrice: { gross: Money },
    quantity: number, 
    id: string, 
    isShippingRequired: boolean, 
    productSku?: string | null, 
    quantityFulfilled: number, 
    quantityToFulfill: number, 
    variant: {
        media: { url: string }[];
        id: string;
        sku?: string | null, 
        name?: string | null, 
        pricing: {
            price: {
                gross: Money
            };
        };
    };
    thumbnail: LineItemThumbnail;
}

export interface OrderInfo {
    created: string,
    id: string,
    isPaid: boolean,
    number: string,
    status: string,
    paymentStatus: string,
    checkoutId: string,
    total:{
        gross:{
            amount: number,
        }
    }
    lines: LineItem[];
    shippingAddress: AddressInfo;
    totalCount: number;
}

export interface OrderDiscountInfo {
    id: string, 
    name?: string | null, 
    reason?: string | null, 
    type: string, 
    value: any, 
    valueType: string, 
    translatedName?: string | null, 
    amount: Money
}

export interface ShippingMethodInfo {
    description: string,
    id: string,
    name: string,
    price: Money,
    type: string,
}

export interface OrderPaymentInfo {
    created: string,
    id: string,
    gateway: string,
    chargeStatus: string,
}

export interface OrderDetailedInfo {
    created: string,
    id: string,
    isPaid: boolean,
    number: string,
    paymentStatus: string,
    checkoutId: string | null,
    customerNote: string,
    displayGrossPrices: boolean,
    isShippingRequired: boolean,
    paymentStatusDisplay: string, 
    status: string, 
    statusDisplay: string, 
    updatedAt: string,
    total: { gross: Money },
    totalAuthorized: Money, 
    totalBalance: Money, 
    totalCanceled: Money, 
    totalCharged: Money, 
    totalRefunded: Money, 
    subtotal: { gross: Money }
    channel: { id: string, slug: string },

    lines: LineItem[],
    shippingAddress: AddressInfo,
    shippingMethod: ShippingMethodInfo,
    discounts: OrderDiscountInfo[],
    weight: { unit: string, value: number },
    payments: OrderPaymentInfo[],
}

