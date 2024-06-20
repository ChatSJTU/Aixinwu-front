import { 
    CheckoutCreateMutation,
    CheckoutCreateDocument,
    CheckoutAddLineMutation, 
    CheckoutAddLineDocument,
    CheckoutGetQuantityQuery,
    CheckoutGetQuantityDocument,
    CheckoutFindQuery,
    CheckoutFindDocument,
    CheckoutLineDeleteMutation,
    CheckoutLineDeleteDocument,
    CheckoutLinesUpdateMutation,
    CheckoutLinesUpdateDocument,
    Checkout,
    Address,
    CheckoutShippingAddressUpdate,
    CheckoutShippingAddressUpdateMutation,
    CheckoutShippingAddressUpdateDocument,
    CheckoutShippingMethodUpdateMutation,
    CheckoutShippingMethodUpdateDocument,
    CheckoutBillingAddressUpdateMutation,
    CheckoutBillingAddressUpdateDocument,
    CheckoutCompleteMutation,
    CheckoutCompleteDocument,
} from "@/graphql/hooks";
import { CheckoutCreateResult, CheckoutDetail, CheckoutLineDetail, CheckoutLineVarientDetail, ShippingMethodDetail } from "@/models/checkout";
import { Token } from "@/models/token";
import { ApolloClient } from "@apollo/client";
import { mapAddressInfo } from "./user";
import { AddressInfo } from "@/models/address";

function mapCheckoutForCart(data: Checkout) : CheckoutDetail {
    return {
        id: data.id,
        totalPrice: data.totalPrice.gross.amount,
        quantity: data.quantity,
        shippingAddress: data.shippingAddress == undefined ? undefined : mapAddressInfo(data.shippingAddress as Address),
        isShippingRequired: data.isShippingRequired,
        availableShippingMethods: data.availableShippingMethods.map(x=>({
            active: x.active,
            id: x.id,
            name: x.name,
            type: x.type,
            description: x.description,
        }) as ShippingMethodDetail),
        lines: data.lines.map(x=>({
            id: x.id,
            quantity: x.quantity,
            totalPrice: x.totalPrice.gross.amount,
            varient: ({
                id: x.variant.id,
                name: x.variant.name,
                price: x.variant.pricing?.priceUndiscounted?.gross.amount,
                product_id: x.variant.product.id,
                product_name: x.variant.product.name,
                product_slug: x.variant.product.slug,
                product_thumbnail: x.variant.product.thumbnail?.url,
                product_category: x.variant.product.category?.name,
            }) as CheckoutLineVarientDetail,
        }) as CheckoutLineDetail),
    } as CheckoutDetail;
}

//新建购物车
export async function checkoutCreate(client: ApolloClient<object>, channel: string) {
    try {
        const resp = await client.mutate<CheckoutCreateMutation>({
            mutation: CheckoutCreateDocument,
            variables: {
                channel: channel
            }
        }); 
        if (!resp.data || 
            !resp.data.checkoutCreate) {
          throw "新建购物车失败";
        }
        if (resp.data.checkoutCreate.errors.length != 0)
        {
          throw resp.data.checkoutCreate.errors[0].message;
        }
        var data = resp.data?.checkoutCreate.checkout as CheckoutCreateResult;
        return data;
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//向购物车添加商品（单件！）
export async function checkoutAddLine(client: ApolloClient<object>, checkoutId: string, varientId: string, quantity: number) {
    try {
        const resp = await client.mutate<CheckoutAddLineMutation>({
            mutation: CheckoutAddLineDocument,
            variables: {
                id: checkoutId,
                productVariantId: varientId,
                quantity: quantity
            }
        }); 
        if (!resp.data || 
            !resp.data.checkoutLinesAdd) {
          throw "添加商品失败";
        }
        if (resp.data.checkoutLinesAdd.errors.length != 0)
        {
          throw resp.data.checkoutLinesAdd.errors[0].message;
        }
        var data = resp.data?.checkoutLinesAdd.checkout as CheckoutCreateResult;
        return data;
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//查询购物车商品数量（显示在navbar）
export async function checkoutGetQuantity(client: ApolloClient<object>, checkoutId: string) {
    try {
        const resp = await client.query<CheckoutGetQuantityQuery>({
            query: CheckoutGetQuantityDocument,
            variables: {
                id: checkoutId
            },
            fetchPolicy: 'no-cache'
        }); 
        if (!resp.data || 
            !resp.data.checkout) {
          throw "获取购物车商品数量失败";
        }
        var data = resp.data?.checkout.quantity as number;
        return data;
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//查询购物车商品（购物车页面）
export async function checkoutFind(client: ApolloClient<object>, checkoutId: string) {
    try {
        const resp = await client.query<CheckoutFindQuery>({
            query: CheckoutFindDocument,
            variables: {
                id: checkoutId
            },
            fetchPolicy: 'no-cache'
        }); 
        if (!resp.data || 
            !resp.data.checkout) {
          throw "获取购物车商品失败";
        }
        var data = resp.data?.checkout as Checkout;
        return mapCheckoutForCart(data);
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//修改购物车商品数量
export async function checkoutUpdateLine(client: ApolloClient<object>, checkoutId: string, lineId: string, quantity: number) {
    try {
        const resp = await client.mutate<CheckoutLinesUpdateMutation>({
            mutation: CheckoutLinesUpdateDocument,
            variables: {
                id: checkoutId,
                lineId: lineId,
                quantity: quantity
            },
            fetchPolicy: 'no-cache'
        }); 
        if (!resp.data || 
            !resp.data.checkoutLinesUpdate) {
          throw "修改购物车商品数量失败";
        }
        if (resp.data.checkoutLinesUpdate.checkoutErrors.length != 0)
        {
          throw resp.data.checkoutLinesUpdate.checkoutErrors[0].message;
        }
        var data = resp.data?.checkoutLinesUpdate.checkout as Checkout;
        return mapCheckoutForCart(data);
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//删除购物车商品
export async function checkoutDeleteLine(client: ApolloClient<object>, checkoutId: string, lineId: string) {
    try {
        const resp = await client.mutate<CheckoutLineDeleteMutation>({
            mutation: CheckoutLineDeleteDocument,
            variables: {
                id: checkoutId,
                lineId: lineId,
            },
            fetchPolicy: 'no-cache'
        }); 
        if (!resp.data || 
            !resp.data.checkoutLineDelete) {
          throw "删除购物车商品失败";
        }
        if (resp.data.checkoutLineDelete.errors.length != 0)
        {
          throw resp.data.checkoutLineDelete.errors[0].message;
        }
        var data = resp.data?.checkoutLineDelete.checkout as Checkout;
        return mapCheckoutForCart(data);
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//更新购物车收货地址
export async function checkoutAddressUpdate(client: ApolloClient<object>, checkoutId: string, address: AddressInfo) {
    try {
        const resp = await client.mutate<CheckoutShippingAddressUpdateMutation>({
            mutation: CheckoutShippingAddressUpdateDocument,
            variables: {
                id: checkoutId,
                shippingAddress: {
                    country: address.country.code,
                    countryArea: address.countryArea,
                    city: address.city,
                    cityArea: address.cityArea,
                    streetAddress1: address.streetAddress1,
                    streetAddress2: address.streetAddress2,
                    postalCode: address.postalCode,
                    companyName: address.companyName,
                    firstName: address.firstName,
                    lastName: address.lastName,
                    phone: address.phone,
                }
            }
        }); 
        if (!resp.data || 
            !resp.data.checkoutShippingAddressUpdate) {
          throw "更新收货地址失败";
        }
        if (resp.data.checkoutShippingAddressUpdate.errors.length != 0)
        {
          throw resp.data.checkoutShippingAddressUpdate.errors[0].message;
        }
        return true;
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//更新发货方式
export async function checkoutShippingMethodUpdate(client: ApolloClient<object>, checkoutId: string, shippingMethodId: string) {
    try {
        const resp = await client.mutate<CheckoutShippingMethodUpdateMutation>({
            mutation: CheckoutShippingMethodUpdateDocument,
            variables: {
                checkoutId: checkoutId,
                shippingMethodId: shippingMethodId
            }
        }); 
        if (!resp.data || 
            !resp.data.checkoutShippingMethodUpdate) {
          throw "更新发货方式失败";
        }
        if (resp.data.checkoutShippingMethodUpdate.errors.length != 0)
        {
          throw resp.data.checkoutShippingMethodUpdate.errors[0].message;
        }
        var data = resp.data?.checkoutShippingMethodUpdate.checkout as Checkout;
        return mapCheckoutForCart(data);
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//更新账单地址
export async function checkoutBillingAddressUpdate(client: ApolloClient<object>, checkoutId: string, address: AddressInfo) {
    try {
        const resp = await client.mutate<CheckoutBillingAddressUpdateMutation>({
            mutation: CheckoutBillingAddressUpdateDocument,
            variables: {
                id: checkoutId,
                billingAddress: {
                    country: address.country.code,
                    countryArea: address.countryArea,
                    city: address.city,
                    cityArea: address.cityArea,
                    streetAddress1: address.streetAddress1,
                    streetAddress2: address.streetAddress2,
                    postalCode: address.postalCode,
                    companyName: address.companyName,
                    firstName: address.firstName,
                    lastName: address.lastName,
                    phone: address.phone,
                }
            }
        }); 
        if (!resp.data || 
            !resp.data.checkoutBillingAddressUpdate) {
          throw "更新账单地址失败";
        }
        if (resp.data.checkoutBillingAddressUpdate.errors.length != 0)
        {
          throw resp.data.checkoutBillingAddressUpdate.errors[0].message;
        }
        return true;
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

//下单
export async function checkoutComplete(client: ApolloClient<object>, checkoutId: string) {
    try {
        const resp = await client.mutate<CheckoutCompleteMutation>({
            mutation: CheckoutCompleteDocument,
            variables: {
                id: checkoutId
            }
        }); 
        if (!resp.data || 
            !resp.data.checkoutComplete) {
          throw "下单失败";
        }
        if (resp.data.checkoutComplete.errors.length != 0)
        {
          throw resp.data.checkoutComplete.errors[0].message;
        }
        return resp.data.checkoutComplete.order?.id;
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};
