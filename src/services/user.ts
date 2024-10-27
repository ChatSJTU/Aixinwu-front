import { 
    Address, 
    UserAddressesDocument, 
    UserAddressesQuery, 
    UserBasicInfoDocument, 
    UserAddressAddMutation, 
    UserAddressAddDocument, 
    UserAddressDeleteDocument, 
    UserAddressDeleteMutation,
    UserAddressUpdateDocument,
    UserAddressUpdateMutation,
    UserOrdersDocument,
    UserOrdersQuery,
    UserCheckoutsQuery,
    UserCheckoutsDocument,
    UserAddressSetDefaultMutation,
    UserAddressSetDefaultDocument,
    UserBalanceEventsQuery,
    UserBalanceEventsDocument,
    UserDonationsQuery,
    UserDonationsDocument,
    UserInvitationCodeDocument,
    UserInvitationCodeQuery,
    UserInvitationCreateDocument,
    UserInvitationCreateMutation,
    AddressInput
} from "@/graphql/hooks";

import { AddressInfo } from "@/models/address";
import { 
    CoinLogInfo, 
    DonationInfo, 
    UserBasicInfo,
    InvitationInfo
} from "@/models/user";
import { ApolloClient } from "@apollo/client";
import { OrderInfo } from "../models/order";

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
            continuous_login_days: data.continuous,
            unpicked_order_count: data.orders.totalCount
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

//新增用户收货地址
export async function addUserAddress(client: ApolloClient<object>, newAddress: AddressInput) {
    try {
        const resp = await client.mutate<UserAddressAddMutation>({
            mutation: UserAddressAddDocument,
            variables: {
              input: newAddress, // 需要符合AddressInput格式
            }
        }); 

        if (!resp.data || 
            !resp.data.accountAddressCreate) {
          throw "新增用户地址：数据为空";
        }
        
        if (resp.data.accountAddressCreate.errors.length != 0)
        {
          throw resp.data.accountAddressCreate.errors[0].message;
        }
        var data = resp.data.accountAddressCreate;
        if (!data.address) {
            throw "更新用户地址返回值为空"
        }
        return mapAddressInfo(data.address as Address);
        
    } catch (error) {
        var errmessage = `新增用户收货地址失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

// 删除用户收货地址
export async function deleteUserAddress(client: ApolloClient<object>, id: string) {
    try {
        const resp = await client.mutate<UserAddressDeleteMutation>({
            mutation: UserAddressDeleteDocument,
            variables: {
              ID: id,
            }
        }); 
        if (!resp.data || !resp.data.accountAddressDelete){
            throw "数据为空"
        }
        if (resp.data.accountAddressDelete.errors.length != 0)
        {
          throw resp.data.accountAddressDelete.errors[0].message;
        }
        
    } catch (error) {
        var errmessage = `删除用户收货地址失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

// 更新用户收货地址
export async function updateUserAddress(client: ApolloClient<object>, id: string, newAddr: AddressInput) {
    try {
        const resp = await client.mutate<UserAddressUpdateMutation>({
            mutation: UserAddressUpdateDocument,
            variables: {
              ID: id,
              NewAddr: newAddr // 需要符合AddressInput格式
            }
        }); 
        if (!resp.data || !resp.data.accountAddressUpdate){
            throw "数据为空"
        }
        if (resp.data.accountAddressUpdate.errors.length != 0)
        {
          throw resp.data.accountAddressUpdate.errors[0].message;
        }
        
    } catch (error) {
        var errmessage = `更新用户收货地址失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

// 设置默认用户收货地址
export async function setDefaultUserAddress(client: ApolloClient<object>, id: string) {
    try {
        const resp = await client.mutate<UserAddressSetDefaultMutation>({
            mutation: UserAddressSetDefaultDocument,
            variables: {
              ID: id,
            }
        }); 
        if (!resp.data || !resp.data.accountSetDefaultAddress){
            throw "数据为空"
        }
        if (resp.data.accountSetDefaultAddress.errors.length != 0)
        {
          throw resp.data.accountSetDefaultAddress.errors[0].message;
        }
        
    } catch (error) {
        var errmessage = `设置默认用户收货地址失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

export async function fetchUserOrders(client: ApolloClient<object>, first: number, last: number) {
    try {
        const resp = await client.query<UserOrdersQuery>({
            query: UserOrdersDocument,
            variables: {
                first: first,
                last: last
            }
        });
        if (!resp.data || !resp.data.me || !resp.data.me.orders){
            throw "数据为空"
        }
        const edges = resp.data.me.orders.edges;
        const res = edges.map(edge => edge.node)
        return {
            totalCount: resp.data.me.orders.totalCount,
            data: res as OrderInfo[]
        };
    } catch (error) {
        var errmessage = `获取用户订单列表失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

export async function fetchUserCheckouts(client: ApolloClient<object>, channel: string) {
    try {
        const resp = await client.query<UserCheckoutsQuery>({
            query: UserCheckoutsDocument,
            variables: {
                channel: channel,
            }
        });
        if (!resp.data || !resp.data.me){
            throw "数据为空"
        }
        const edges = resp.data.me.checkoutIds;
        return edges as (string[] | null);
    } catch (error) {
        var errmessage = `获取用户购物车失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

export async function fetchUserBalanceEvents(client: ApolloClient<object>, first: number, last: number, userName: string) {
    try {
        const resp = await client.query<UserBalanceEventsQuery>({
            query: UserBalanceEventsDocument,
            variables: {
                first: first,
                last: last,
                user: userName,
            }
        });
        if (!resp.data || !resp.data.balanceEvents){
            throw "数据为空"
        }
        const edges = resp.data.balanceEvents.edges;
        let coinLogs = edges.map(x => x.node as CoinLogInfo) as CoinLogInfo[]
        let totalCount = resp.data.balanceEvents.totalCount as number;

        return ({
            coinLogs,
            totalCount
        })

    } catch (error) {
        var errmessage = `获取用户爱心币日志失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

export async function fetchUserDonations(client: ApolloClient<object>, first: number, last: number) {
    try {
        const resp = await client.query<UserDonationsQuery>({
            query: UserDonationsDocument,
            variables: {
                first: first,
                last: last,
            }
        });
        if (!resp.data || !resp.data.donations){
            throw "数据为空"
        }
        const edges = resp.data.donations.edges;
        let donations = edges.map((edge) => {
            return ({
                id: edge.node.id,
                number: Number(edge.node.number),
                quantity: Number(edge.node.quantity),
                title: edge.node.title,
                price: edge.node.price,
                createdAt: edge.node.createdAt,
                status: edge.node.status,
                barcode: edge.node.barcode,
                updatedAt: edge.node.updatedAt,
                description: edge.node.description,
            })
        }) as DonationInfo[]
        let totalCount = resp.data.donations.totalCount as number;

        return ({
            donations,
            totalCount
        })

    } catch (error) {
        var errmessage = `获取用户捐赠记录失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

export async function fetchUserInvitationCodes(client: ApolloClient<object>) {
    try {
        const resp = await client.query<UserInvitationCodeQuery>({
            query: UserInvitationCodeDocument,
        });
        if (!resp.data || !resp.data.me){
            throw "数据为空"
        }
        const edges = resp.data.me.invitations?.edges;
        let invitations = edges?.map((edge) => {
            return ({
                id: edge.node.id,
                code: edge.node.code,
                createdAt: edge.node.createdAt,
                expiredAt: edge.node.expiredAt,
            })
        }) as InvitationInfo[]
        return invitations
    } catch (error) {
        var errmessage = `获取用户邀请码失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}

export async function createUserInvitationCode(client: ApolloClient<object>) {
    try {
        const resp = await client.mutate<UserInvitationCreateMutation>({
            mutation: UserInvitationCreateDocument,
        });
        if (!resp.data || !resp.data.invitationCreate){
            throw "数据为空"
        }
        if (resp.data.invitationCreate.errors.length != 0)
        {
          throw resp.data.invitationCreate.errors[0].message;
        }
        return resp.data.invitationCreate.invitation as InvitationInfo
    } catch (error) {
        var errmessage = `创建用户邀请码失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}