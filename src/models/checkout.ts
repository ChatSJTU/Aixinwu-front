import { TableRowSelection } from "antd/es/table/interface";
import { AddressInfo } from "./address";
import { Money } from "./common";

export interface CheckoutCreateResult {
    id: string;
    quantity: number;
    isShippingRequired: boolean;
    totalPrice: { gross: Money };
    shippingAddress: AddressInfo;
}

export interface CheckoutDetail {
    id: string;
    lines: CheckoutLineDetail[] | null;
    totalPrice: { gross: Money };
    quantity: number;
    shippingAddress: AddressInfo;
    isShippingRequired: boolean;
    availableShippingMethods : ShippingMethodDetail[] | null;
    note: string | undefined;
}

export interface CheckoutLineDetail {
    id: string;
    quantity: number;
    totalPrice: number;
    varient: CheckoutLineVarientDetail;
}

export interface CheckoutLineVarientDetail {
    id: string;
    name: string;
    price: number;
    product_id: string;
    product_name: string;
    product_slug: string;
    product_thumbnail: string;
    product_category: string;
    stock: number;
    quantityLimit: number | undefined;
    quantityAvailable: number | undefined;
}

export interface CheckoutTableListProps {
    CheckoutLines: CheckoutLineDetail[];
    onClickDelete: Function;
    onItemNumberChange: Function;
    onItemNumberMinus: Function;
    onItemNumberPlus: Function;
}

export interface ShippingMethodDetail {
    active: boolean;
    id: string;
    name: string;
    type: string;
    description: string;
}