import { 
    CategoriesDocument,
    ProductDetailDocument,
    ProductDetailQuery,
    ProductsByCategoryIdDocument,
    ProductsByCategoryIdQuery,
    ProductOrderField
} from "@/graphql/hooks";
import { Category, ProductDetail, VarientDetail, ProductSummary } from "@/models/products";
import { ApolloClient } from "@apollo/client";

//获取商品分类列表（扁平和树）
export async function fetchCategories(client: ApolloClient<object>) {
    try {
        const resp = await client.query({ query: CategoriesDocument }); 
        if (!resp.data || !resp.data.categories) {
            throw "数据为空";
        }
        const { edges } = resp.data.categories;
        const flatList: Category[] = edges.map((edge: { node: Category }) => ({ ...edge.node, children: [] }));

        // 映射
        const idToCategoryMap: { [key: string]: Category } = {};
        flatList.forEach(category => {
            idToCategoryMap[category.id] = category;
        });

        // 树
        const treeCategories: Category[] = [];
        flatList.forEach(category => {
            if (category.level === 0) {
                treeCategories.push(category);
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

        return { flatList, treeCategories };

    } catch (error) {
        const errmessage = `获取商品分类失败：${error}`;
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
        } as ProductDetail;
        return res;
    } catch (error) {
        var errmessage = `请求失败：${error}`
        console.error(errmessage);
        throw errmessage;
    }
};

// 按分类 ID 获取商品列表
export async function fetchProductsByCategoryID(client: ApolloClient<object>, first:number, categoryID: string, sort: string) {
    try {
        const sortOptions: { [key: string]: ProductOrderField } = {
            'time': ProductOrderField.LastModifiedAt,
            'price-up': ProductOrderField.Price,
            'price-down': ProductOrderField.MinimalPrice,
            'default': ProductOrderField.Name
        };
        
        let sortField = sortOptions[sort as keyof typeof sortOptions] || ProductOrderField.Name;
        // console.log(sortField);
        const resp = await client.query<ProductsByCategoryIdQuery>({
            query: ProductsByCategoryIdDocument,
            variables: {
                first: first,
                categories: [categoryID],
                field: sortField
            }
        }); 
        if (!resp.data || 
            !resp.data.products) {
          throw "获取商品列表失败";
        }

        const productSummaries: ProductSummary[] = resp.data.products.edges.map((edge: { node: any }) => ({
            image_url: edge.node.images.map((image: { url: string }) => image.url),
            product_name: edge.node.name,
            product_id: edge.node.id,
            detailed_product_name: edge.node.slug,
            cost: edge.node.pricing?.priceRange?.start?.gross?.amount || 0,
            stock: edge.node.isAvailable ? 1 : 0,
        }));

        return productSummaries;

    } catch (error) {
        const errmessage = `获取商品列表失败：${error}`;
        console.error(errmessage);
        throw errmessage;
    }
};