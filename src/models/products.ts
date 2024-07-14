export interface Category {
    id: string;
    level: number;
    description: string | null;
    name: string;
    seoDescription: string | null;
    seoTitle: string | null;
    slug: string;
    parent: {id: string} | null;
    children: Category[] | null;
    products: {totalCount: number} | null;
}
  
export interface ProductDetail {
    images: string[] | null;
    channel: string;
    name: string;
    id: string;
    slug: string;
    detailed_product_name: string | null;
    desc: string;
    varients: VarientDetail[];
    price: {
        min: number;
        max: number;
    };
}

export interface VarientDetail {
    name: string;
    id: string;
    sku: string;
    stock: number;
    update_time: string;
    price: number
    [propName: string]: any;
    quantityLimit: number;
}

export interface ProductSummary {
    image_url: string[]; // 长度至少为1
    product_name: string;
    product_id: number;
    product_slug: string;
    detailed_product_name?: string;
    stock?: number;
    [propName: string]: any;
    price: {
        min: number;
        max: number;
    };
}

export interface ProductSummaryProps {
    productSummary: ProductSummary;
}

export interface ProductSummaryList {
    products: ProductSummary[]; // 长度至少为1的数组
}