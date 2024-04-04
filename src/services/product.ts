import { 
    CategoriesDocument,
    ProductDetailDocument,
    ProductDetailQuery
} from "@/graphql/hooks";
import { Category, ProductDetails, VarientDetail } from "@/models/products";
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

//查询商品详情（商品详情页）
export async function getProductDetail(client: ApolloClient<object>, channel: string, slug: string) {
    try {
        const resp = await client.query<ProductDetailQuery>({
            query: ProductDetailDocument,
            variables: {
                slug: slug,
                channel: channel
            }
        }); 
        if (!resp.data || 
            !resp.data.product) {
          throw "获取商品详情失败";
        }
        var data = resp.data?.product;
        var res = {
            id: data.id,
            slug: data.slug,
            name: data.name,
            images: data.media?.map(x=>x.url),
            detailed_product_name: "",
            desc: data.description,
            varients: data.variants?.map(x=>({
                name: x.name,
                id: x.id,
                sku: x.sku,
                stock: x.quantityAvailable,
                update_time: x.updatedAt,
                price: x.pricing?.priceUndiscounted?.gross.amount
            } as VarientDetail))
        } as ProductDetails;
        return res;
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};