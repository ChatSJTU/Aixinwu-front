import ProductDetailsPage from "@/pages/products/single/[id]";
import exp from "node:constants";

export interface ProductDetails {
    image_url: string[]; // 长度至少为1
    product_name: string;
    detailed_product_name?: string;
    desc: string;
    cost: number;
    stock?: number;
    upload_time?: string;
    [propName: string]: any;
}

export interface ProductSummary {
    image_url: string[]; // 长度至少为1
    product_name: string;
    product_id: number
    detailed_product_name?: string;
    cost: number;
    stock?: number;
    [propName: string]: any;
}

export interface ProductSummaryList {
    products: ProductSummary[]; // 长度至少为1的数组
}

export const ProductDetailsExample = {
    image_url: ["https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg",
        "https://aixinwu.sjtu.edu.cn/uploads/product/6394/202203_347.jpg",
        "https://aixinwu.sjtu.edu.cn/uploads/product/6457/202306_347.jpg"],
    product_name: "新航道2023考研政治900题",
    detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题",
    desc: "//此部分后续可更换为嵌入html代码，需注意DOM-based XSS\n\n商品名称：新航道2023考研政治900题\n出版社：世界知识出版社\n本书有以下特点：\n1.根据考试大纲、2021版新教材编写，考点覆盖，重点突出，讲解详实。\n2.中国人民大学教授、原考研政治命题专家主编。\n3.偶数页题目、奇数页答案对应编排，人性化设计方便考生刷题。",
    cost: 24,
    stock: 907
}

export const ProductSummaryExample = {
    image_url: ["https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg"],
    product_name: "新航道2023考研政治900题",
    product_id: 6395,
    detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题",
    cost: 24,
    stock: 907
}