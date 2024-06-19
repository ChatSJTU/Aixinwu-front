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
    name: string;
    id: string;
    slug: string;
    detailed_product_name: string | null;
    desc: string;
    varients: VarientDetail[]
}

export interface VarientDetail {
    name: string;
    id: string;
    sku: string;
    stock: number;
    update_time: string;
    price: number
    [propName: string]: any;
}

export interface ProductSummary {
    image_url: string[]; // 长度至少为1
    product_name: string;
    product_id: number;
    detailed_product_name?: string;
    cost: number;
    stock?: number;
    [propName: string]: any;
}

export interface ProductSummaryProps {
    productSummary: ProductSummary;
}

export interface ProductSummaryList {
    products: ProductSummary[]; // 长度至少为1的数组
}

export const ProductDetailsExample = {
    image_url: ["https://aixinwu.sjtu.edu.cn/uploads/product/6395/202203_347.jpg",
        "https://aixinwu.sjtu.edu.cn/uploads/product/6394/202203_347.jpg",
        "https://aixinwu.sjtu.edu.cn/uploads/product/6457/202306_347.jpg"],
    product_name: "新航道2023考研政治900题",
    product_id: 122,
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

export const ProductSummaryExampleList = [
    {
        image_url: ["https://gw.alicdn.com/imgextra/i3/2208377286554/O1CN01J3AiUF1yHmXSkmX92_!!2208377286554.jpg_Q75.jpg_.webp"],
        product_name: "新航道2023考研政治900题",
        product_id: 1,
        detailed_product_name: "新航道考研政治2023年徐之明思想政治理论金榜书900题",
        cost: 24,
        stock: 907
    },
    {
        image_url: ["https://gw.alicdn.com/imgextra/O1CN01ByoP8w1CP1OEei4ub-101450072.jpg_Q75.jpg_.webp"],
        product_name: "计算机网络",
        product_id: 2,
        detailed_product_name: "计算机网络 自顶向下方法 原书第8版",
        cost: 68.8,
        stock: 3000
    },
    {
        image_url: ["https://gw.alicdn.com/imgextra/O1CN01JzdVG21CP1LaSAvZG-101450072.jpg_Q75.jpg_.webp"],
        product_name: "计算机组成与设计",
        product_id: 3,
        detailed_product_name: "计算机组成与设计 硬件/软件接口 MIPS版 原书第6版",
        cost: 74.5,
        stock: 3000
    },
    {
        image_url: ["https://gw.alicdn.com/imgextra/i1/249772349/O1CN01yGm72o1TDtHIi3ebB_!!0-item_pic.jpg_Q75.jpg_.webp"],
        product_name: "数据结构",
        product_id: 4,
        detailed_product_name: "正版任选 数据结构c语言版严蔚敏 教材+题集 清华大学出版社 严蔚敏数据结构与算法分析 408计算机考研教材教程 大学教材辅导书籍",
        cost: 31.2,
        stock: 3000
    },
    {
        image_url: ["https://gw.alicdn.com/imgextra/i1/391838199/O1CN01A98FfN2ARC7JLYaoz_!!391838199.jpg_Q75.jpg_.webp"],
        product_name: "软件工程原理、方法与应用",
        product_id: 5,
        detailed_product_name: "现货包邮 软件工程原理、方法与应用 第三版第3版 史济民 顾春华 郑红 普通高等教育“十一五”规划教材 高等教育出版社",
        cost: 32.9,
        stock: 3000
    },
]