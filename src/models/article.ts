export interface ArticleDetails {
    id: number;
    title: string;
    description: string | null;
    author: string;
    content: string;
    publish_time: string;
    navigation: { name: string; id: number; }[];
    reads_count: number;
    sort: number;
    next: { id: number; title: string; } | null;
    previous: { id: number; title: string; } | null;
}

export interface ArticleSummaries {
    id: number;
    title: string;
    description: string | null;
    author: string;
    publish_time: string;
    navigation: { name: string; id: number; }[];
    reads_count: number;
    sort: number;
}