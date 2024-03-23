import { ArticleCategoriesDocument } from "@/graphql/hooks";
import { ArticleDetails, ArticleSummaries } from "@/models/article";
import { ApolloClient } from "@apollo/client";

//获取文章分类, 返回 { name: string, id: string }[]
export async function fetchArticleCategories(client: ApolloClient<object>) {
    try {
        const resp = await client.query({ query: ArticleCategoriesDocument });
        if (!resp.data ||
            !resp.data.pageTypes) {
            throw "数据为空";
        }

        const { edges } = resp.data.pageTypes;
        const res: { name: string; id: string; }[] = edges.map((edge: { node: { name: string; id: string; }; }) => ({
            name: edge.node.name,
            id: edge.node.id
        }));

        return res;

    } catch (error) {
        var errmessage = `获取文章分类失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};
