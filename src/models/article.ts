export interface ArticleDetails {
    id: string;
    title: string;
    description: string | null;
    author: string;
    content: string;
    publish_time: string;
    navigation: { name: string; id: string; }[];
    reads_count: number;
    sort: number;
    next: { id: number; title: string; } | null;
    previous: { id: number; title: string; } | null;
}

export interface ArticleSummaries {
    id: string;
    title: string;
    description: string | null;
    publish_time: string;
    navigation: { name: string; id: string; }[];
    sort?: number;
}