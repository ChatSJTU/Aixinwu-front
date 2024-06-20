export interface ArticleDetails {
    id: string;
    title: string;
    description: string | null;
    author: string;
    content: string;
    publish_time: string;
    reads_count: number;
    cursor: string;
    navigation: { name: string, id: string };
    next: { id: number; title: string; } | null;
    previous: { id: number; title: string; } | null;
}

export interface ArticleSummary {
    id: string;
    title: string;
    description: string | null;
    publish_time: string;
}