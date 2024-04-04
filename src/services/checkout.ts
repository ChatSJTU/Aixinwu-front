import { 
    CheckoutCreateMutation,
    CheckoutCreateDocument,
    CheckoutAddLineMutation, 
    CheckoutAddLineDocument,
    CheckoutGetQuantityQuery,
    CheckoutGetQuantityDocument
} from "@/graphql/hooks";
import { CheckoutCreateResult } from "@/models/checkout";
import { Token } from "@/models/token";
import { ApolloClient } from "@apollo/client";

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
            }
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