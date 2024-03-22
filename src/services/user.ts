import { UserBasicInfoDocument } from "@/graphql/hooks";
import { UserBasicInfo } from "@/models/user";
import { ApolloClient } from "@apollo/client";

//获取用户信息
export async function fetchUserBasicInfo(client: ApolloClient<object>) {
    try {
        const resp = await client.query({query: UserBasicInfoDocument}); 
        if (!resp.data || 
            !resp.data.me) {
          throw "数据为空";
        }
        var data = resp.data.me
        return {
            name: data.firstName,
            email: data.email,
            type: data.userType,
            balance: data.balance,
            continuous_login_days: data.continuous
        } as UserBasicInfo;
    } catch (error) {
        var errmessage = `获取用户数据失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};
