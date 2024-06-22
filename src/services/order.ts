import { OrderDetailedDocument, OrderDetailedQuery, OrderPayDocument, OrderPayMutation } from "@/graphql/hooks";
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
            throw "数据为空"
        }
        if (resp.data.orderConfirm.errors.length != 0)
        {
          throw resp.data.orderConfirm.errors[0].message;
        }
        return resp.data.orderConfirm.order as OrderInfo;
    } catch (error) {
        var errmessage = `订单支付失败：${error}`
        console.error(errmessage);
        throw errmessage;
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