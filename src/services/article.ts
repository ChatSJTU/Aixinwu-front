import { ArticleCategoriesDocument, ArticleByTypeDocument, ArticleByIdDocument } from "@/graphql/hooks";
import { ArticleDetails, ArticleSummaries } from "@/models/article";
import { ApolloClient } from "@apollo/client";
import { json } from "stream/consumers";

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

// 根据分类获取文章内容, 返回articleSummaries[]
export async function fetchArticlesByType(client: ApolloClient<object>, caregoryID: string, maxFetch: Number = 100) {
    try {
        const resp = await client.query({
            query: ArticleByTypeDocument,
            variables: {
                maxFetch: maxFetch,
                type: caregoryID,
                fetchContent: false,
            }
        });
        if (!resp.data ||
            !resp.data.pages) {
            throw "数据为空";
        }
        if (resp.errors) {
            throw resp.errors[0].message;
        }

        const { edges } = resp.data.pages;

        const res: ArticleSummaries[] = edges.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            description: edge.node.seoDescription,
            publish_time: edge.node.publishedAt,
        }));
        return res;

    } catch (error) {
        var errmessage = `获取文章列表失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

// 根据文章ID获取指定文章详情, 返回articleDetails
export async function fetchArticlesById(client: ApolloClient<object>, articleID: string) {
    try {
        const resp = await client.query({
            query: ArticleByIdDocument,
            variables: {
                id: articleID,
            }
        });
        if (!resp.data ||
            !resp.data.pages) {
            throw "数据为空";
        }
        if (resp.errors) {
            throw resp.errors[0].message;
        }

        const { node, cursor } = resp.data.pages.edges[0];
        const textBlocks = JSON.parse(node.content).blocks.map((block: any) => (block.data.text));
        const textJoined = textBlocks.join('\n')

        const res: ArticleDetails = {
            id: node.id,
            title: node.title,
            description: node.seoDescription,
            author: "aixinwu",
            content: textJoined,
            reads_count: 0,
            publish_time: node.publishedAt,
            navigation: {name: node.pageType.name, id: node.pageType.id},
            // TODO: add next / prev ID
            next: null,
            previous: null,
            cursor: cursor,
        };
        return res;

    } catch (error) {
        var errmessage = `获取文章详情失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};
