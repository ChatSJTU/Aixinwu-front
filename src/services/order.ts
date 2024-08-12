import { OrderCancelDocument, OrderCancelMutation, OrderDetailedDocument, OrderDetailedQuery, OrderPayDocument, OrderPayMutation } from "@/graphql/hooks";
import { OrderDetailedInfo, OrderInfo } from "@/models/order";
import { ApolloClient } from "@apollo/client";

//支付订单
export async function orderPay(client: ApolloClient<object>, id: string) {
    try {
        const resp = await client.mutate<OrderPayMutation>({
            mutation: OrderPayDocument,
            variables: {
              id: id
            }
        }); 
        if (!resp.data || !resp.data.orderConfirm){
            throw {code: "NO_DATA"}
        }
        return resp.data.orderConfirm.order as OrderInfo;
    } catch (error: any) {
        if (error.code) throw error;
        if (error.message === 'Expected a value of type "OrderErrorCode" but received: balance_check_error')
            throw {code: "NO_BALANCE"}
        throw error
    }
}

//查询订单详情
export async function orderDetailed(client: ApolloClient<object>, id: string) {
    try {
        const resp = await client.query<OrderDetailedQuery>({
            query: OrderDetailedDocument,
            variables: {
              id: id
            }
        }); 
        if (!resp.data || !resp.data.order){
            throw "数据为空"
        }
        return resp.data.order as OrderDetailedInfo;
    } catch (error) {
        var errmessage = `查询订单详情失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

//取消订单
export async function orderCancel(client: ApolloClient<object>, id: string) {
    try {
        const resp = await client.mutate<OrderCancelMutation>({
            mutation: OrderCancelDocument,
            variables: {
              id: id
            }
        }); 
        if (!resp.data || !resp.data.orderCancel){
            throw {code: "NO_DATA"}
        }
        return resp.data.orderCancel.order?.status
    } catch (error: any) {
        var errmessage = `取消订单失败：${error}`
        throw errmessage;
    }
}