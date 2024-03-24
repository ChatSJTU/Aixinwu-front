import { ArticleCategoriesDocument, ArticleByTypeDocument } from "@/graphql/hooks";
import { ArticleDetails, ArticleSummaries } from "@/models/article";
import { ApolloClient } from "@apollo/client";
import { Descriptions } from "antd";
import { title } from "process";

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

//获取文章内容, 根据fetchContent返回Detail / Summary
export async function fetchArticles(client: ApolloClient<object>, caregoryID: string, maxFetch: Number = 100, fetchContent: boolean = false) {
    try {
        const resp = await client.query({
            query: ArticleByTypeDocument,
            variables: {
                maxFetch: maxFetch,
                type: caregoryID,
                fetchContent: fetchContent,
            }
        });
        if (!resp.data ||
            !resp.data.pages) {
            throw "数据为空";
        }
        if(resp.errors) {
            throw resp.errors[0].message;
        }

        const { edges } = resp.data.pages;
        if(fetchContent) {
            const res: ArticleDetails[] = edges.map((edge: any) => ({
                id: edge.node.id,
                title: edge.node.title,
                description: edge.node.seoDescription,
                author: edge.node.author ? edge.node.author : "aixinwu",
                content: JSON.parse(edge.node.content).data.text,
                reads_count: edge.node.reads_count ? edge.reads_count : 0,
                publish_time: edge.node.publishedAt,
                next: null,
                prev: null,
                cursor: edge.cursor
            }));
            return res;
        }
        else {
            const res: ArticleSummaries[] = edges.map((edge: any) => ({
                id: edge.node.id,
                title: edge.node.title,
                description: edge.node.seoDescription,
                publish_time: edge.node.publishedAt,
            }));
            return res;
        }
    } catch (error) {
        var errmessage = `获取文章内容失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};
