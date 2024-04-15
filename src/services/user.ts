import { Address, UserAddressesDocument, UserAddressesQuery, UserBasicInfoDocument } from "@/graphql/hooks";
import { AddressInfo } from "@/models/address";
import { UserBasicInfo } from "@/models/user";
import { ApolloClient } from "@apollo/client";

export function mapAddressInfo(data: Address) : AddressInfo {
    return {
        id: data.id,
        isDefaultBillingAddress: data.isDefaultBillingAddress,
        isDefaultShippingAddress: data.isDefaultShippingAddress,
        country: {
          code: data.country.code,
          country: data.country.country,
        },
        countryArea: data.countryArea,
        city: data.city,
        cityArea: data.cityArea,
        streetAddress1: data.streetAddress1,
        streetAddress2: data.streetAddress2,
        postalCode: data.postalCode,
        companyName: data.companyName,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
    } as AddressInfo;
}

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

//获取用户收货地址
export async function fetchUserAddresses(client: ApolloClient<object>) {
    try {
        const resp = await client.query<UserAddressesQuery>(
            {
                query: UserAddressesDocument,
                fetchPolicy: 'network-only'
            }
        ); 
        if (!resp.data || 
            !resp.data.me) {
          throw "数据为空";
        }
        var data = resp.data.me
        return data.addresses.map(x => mapAddressInfo(x as Address));
    } catch (error) {
        var errmessage = `获取用户收货地址失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};
