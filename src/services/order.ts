import { OrderPayDocument, OrderPayMutation } from "@/graphql/hooks";
import { OrderInfo } from "@/models/order";
import { ApolloClient } from "@apollo/client";

//支付订单
export async function orderPay(client: ApolloClient<object>, id: string) {
    try {
        const resp = await client.mutate<OrderPayMutation>({
            mutation: OrderPayDocument,
            variables: {
              ID: id
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