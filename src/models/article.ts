export interface ArticleDetails {
    id: number;
    title: string;
    description: string | null;
    author: string;
    content: string;
    publish_time: string;
    navigation?: { name: string; id: number; }[];
    reads_count: number;
    sort: number;
}