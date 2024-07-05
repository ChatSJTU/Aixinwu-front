import { 
    CategoriesDocument,
    CategoriesQuery,
    ProductDetailDocument,
    ProductDetailQuery,
    ProductsByCategoryIdDocument,
    ProductsByCategoryIdQuery,
    ProductOrderField,
    ProductsByCollectionDocument,
    ProductsByCollectionQuery,
    ProductsSearchByNameDocument,
    ProductsSearchByNameQuery
} from "@/graphql/hooks";
import { Category, ProductDetail, VarientDetail, ProductSummary } from "@/models/products";
import { ApolloClient } from "@apollo/client";

//获取商品分类列表（扁平和树）
export async function fetchCategories(client: ApolloClient<object>, channel: string) {
    try {
        const resp = await client.query<CategoriesQuery>({
            query: CategoriesDocument,
            variables: {
                channel: channel
            }
        }); 
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

        // 递归函数计算总产品数
        const calculateTotalProducts = (category: Category): number => {
            if (!category.children || category.children.length === 0) {
                return category.products?.totalCount || 0;
            }
            let totalCount = 0;
            category.children.forEach(child => {
                totalCount += calculateTotalProducts(child);
            });
            if (category.products) {
                category.products = { ...category.products, totalCount: totalCount };
            }
            return totalCount;
        };

        treeCategories.forEach(rootCategory => {
            calculateTotalProducts(rootCategory);
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
        const textBlocks = JSON.parse(data.description).blocks.map((block: any) => (block.data.text));
        console.log(textBlocks)
        const textJoined = textBlocks.join('<br />')
        var res = {
            id: data.id,
            slug: data.slug,
            name: data.name,
            images: data.media?.map(x=>x.url),
            detailed_product_name: "",
            desc: textJoined,
            channel: data.channel,
            varients: data.variants?.map(x=>({
                name: x.name,
                id: x.id,
                sku: x.sku,
                stock: x.stocks![0].quantity,
                update_time: x.updatedAt,
                price: x.pricing?.priceUndiscounted?.gross.amount,
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
export async function fetchProductsByCategoryID(client: ApolloClient<object>, channel: string, first:number, categoryID: string[], sort: string) {
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
                channel: channel,
                first: first,
                categories: categoryID,
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
            product_slug: edge.node.slug,
            detailed_product_name: edge.node.seoDescription,
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

// 按collection slugs获取商品列表
export async function fetchProductsByCollection(client: ApolloClient<object>, channel:string, first:number, slug:String) {
    try {
        
        const resp = await client.query<ProductsByCollectionQuery>({
            query: ProductsByCollectionDocument,
            variables: {
                channel: channel,
                first: first,
                slugs: [slug]
            }
        }); 
        if (!resp.data || !resp.data.collections) {
            throw "获取商品集合失败";
        }

        const productSummaries: ProductSummary[] = resp.data.collections.edges.flatMap((collection: { node: any }) =>
            collection.node.products.edges.map((edge: { node: any }) => ({
                image_url: edge.node.images.map((image: { url: string }) => image.url),
                product_name: edge.node.name,
                product_id: edge.node.id,
                product_slug: edge.node.slug,
                detailed_product_name: edge.node.seoDescription,
                cost: edge.node.pricing?.priceRangeUndiscounted?.start?.gross?.amount || 0,
                stock: edge.node.isAvailable ? 1 : 0,
            }))
        );

        return productSummaries;

    } catch (error) {
        const errmessage = `获取商品集合失败：${error}`;
        console.error(errmessage);
        throw errmessage;
    }
};

// 按名称搜索商品
export async function searchProducts(client: ApolloClient<object>, first:number, keyword:string, sort:string) {
    try {
        const sortOptions: { [key: string]: ProductOrderField } = {
            'time': ProductOrderField.LastModifiedAt,
            'price-up': ProductOrderField.Price,
            'price-down': ProductOrderField.MinimalPrice,
            'default': ProductOrderField.Name
        };
        
        let sortField = sortOptions[sort as keyof typeof sortOptions] || ProductOrderField.Name;
        const resp = await client.query<ProductsSearchByNameQuery>({
            query: ProductsSearchByNameDocument,
            variables: {
                first: first,
                search: keyword,
                field: sortField
            }
        }); 
        if (!resp.data || 
            !resp.data.products) {
          throw "获取搜索结果失败";
        }

        const totalCount = resp.data.products.totalCount;
        const productSummaries: ProductSummary[] = resp.data.products.edges.map((edge: { node: any }) => ({
            image_url: edge.node.images.map((image: { url: string }) => image.url),
            product_name: edge.node.name,
            product_id: edge.node.id,
            product_slug: edge.node.slug,
            detailed_product_name: edge.node.seoDescription,
            cost: edge.node.pricing?.priceRange?.start?.gross?.amount || 0,
            stock: edge.node.isAvailable ? 1 : 0,
        }));

        return {totalCount, productSummaries};

    } catch (error) {
        const errmessage = `获取搜索结果失败：${error}`;
        console.error(errmessage);
        throw errmessage;
    }
};