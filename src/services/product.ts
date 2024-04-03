import { CategoriesDocument } from "@/graphql/hooks";
import { Category } from "@/models/products";
import { ApolloClient } from "@apollo/client";

//获取商品分类树列表
export async function fetchCategories(client: ApolloClient<object>) {
    try {
        const resp = await client.query({query: CategoriesDocument}); 
        if (!resp.data || 
            !resp.data.categories) {
          throw "数据为空";
        }
        const { edges } = resp.data.categories;
        const flatList: Category[] = edges.map((
            edge: { node: Category }
        ) => ({ ...edge.node, children: [] }));

        // 映射
        const idToCategoryMap: { [key: string]: Category } = {};
        flatList.forEach(category => {
            idToCategoryMap[category.id] = category;
        });

        // 树
        const rootCategories: Category[] = [];
        flatList.forEach(category => {
            if (category.level === 0) {
                rootCategories.push(category);
            } else if (category.parent) {
                const parentCategory = idToCategoryMap[category.parent.id];
                if (parentCategory) {
                    if (!parentCategory.children) {
                        parentCategory.children = [];
                    }
                    parentCategory.children.push(category);
                }
            }
        });

        return rootCategories; 

    } catch (error) {
        var errmessage = `获取商品分类失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};