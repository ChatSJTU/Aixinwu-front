// 主页轮播图与统计数据
import { 
    CarouselUrlsDocument,
    CarouselUrlsQuery,
    StatisticsDocument,
    StatisticsQuery
} from "@/graphql/hooks";

import { ApolloClient } from "@apollo/client";
import { SiteStatistics } from "@/models/site-statistics";

// 获取轮播图 url
export async function fetchCarouselUrls(client: ApolloClient<object>) {
    try {
        const resp = await client.query({query: CarouselUrlsDocument}); 
        if (!resp.data || 
            !resp.data.carousel) {
          throw "数据为空";
        }
        var urls = resp.data.carousel.urls
        return urls;
    } catch (error) {
        var errmessage = `获取商品轮播图失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

// 获取统计数据
export async function fetchStatistics(client: ApolloClient<object>) {
    try {
        const resp = await client.query({query: StatisticsDocument}); 
        if (!resp.data || 
            !resp.data.statistics) {
          throw "数据为空";
        }
        var data = resp.data.statistics
        return {
            circulatedCurrency: data.circulatedCurrency,
            circulatedItems: data.circulatedItems,
            users: data.users,
            views: data.views
        } as SiteStatistics;
    } catch (error) {
        var errmessage = `获取网站数据失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
}