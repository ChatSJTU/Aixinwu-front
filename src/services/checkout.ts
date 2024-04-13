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
} from "@/graphql/hooks";
import { CheckoutCreateResult, CheckoutDetail, CheckoutLineDetail, CheckoutLineVarientDetail } from "@/models/checkout";
import { Token } from "@/models/token";
import { ApolloClient } from "@apollo/client";

function mapCheckoutForCart(data: Checkout) : CheckoutDetail {
    return {
        id: data.id,
        totalPrice: data.totalPrice.gross.amount,
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