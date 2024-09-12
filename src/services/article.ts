import { 
    ArticleCategoriesDocument, 
    ArticleByTypeDocument, 
    ArticleByIdDocument,
    ArticleSearchByNameQuery,
    ArticleSearchByNameDocument,
    ArticleBySlugDocument,
    ArticleBySlugQuery
} from "@/graphql/hooks";
import { ArticleDetails, ArticleSummary } from "@/models/article";
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

// 根据分类获取文章内容, 返回ArticleSummary[]
export async function fetchArticlesByType(client: ApolloClient<object>, first: number, last: number, caregoryID: string) {
    try {
        const resp = await client.query({
            query: ArticleByTypeDocument,
            variables: {
                first: first,
                last: last,
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

        const res: ArticleSummary[] = edges.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            description: edge.node.seoDescription,
            publish_time: edge.node.publishedAt,
        }));
        return ({
            totalCount: edges.totalCount,
            articleSummaries: res,
        });

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
        const textJoined = textBlocks.join('<br />')

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

// 根据文章SLUG获取指定文章详情
export async function fetchArticleBySlug(client: ApolloClient<object>, slug: string) {
    try {
        const resp = await client.query<ArticleBySlugQuery>({
            query: ArticleBySlugDocument,
            variables: {
                slug: slug,
            }
        });
        if (!resp.data ||
            !resp.data.page) {
            throw "数据为空";
        }
        if (resp.errors) {
            throw resp.errors[0].message;
        }

        const node = resp.data.page;
        const textBlocks = JSON.parse(node.content).blocks.map((block: any) => (block.data.text));
        const textJoined = textBlocks.join('<br />')

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
            cursor: null,
        };
        return res;

    } catch (error) {
        var errmessage = `获取文章详情失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

// 搜索文章，返回 ArticleSummary[]
export async function searchArticles(client: ApolloClient<object>, first: number, last:number, keyword: string) {
    try {
        const resp = await client.query<ArticleSearchByNameQuery>({
            query: ArticleSearchByNameDocument,
            variables: {
                first: first,
                last: last,
                search: keyword
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

        console.log(resp);

        const totalCount = resp.data.pages.totalCount;
        const articleSummaries: ArticleSummary[] = edges.map((edge: any) => ({
            id: edge.node.id,
            title: edge.node.title,
            description: edge.node.seoDescription,
            publish_time: edge.node.publishedAt,
        }));

        return {totalCount, articleSummaries}

    } catch (error) {
        var errmessage = `获取文章列表失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};