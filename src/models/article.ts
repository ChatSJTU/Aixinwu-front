export interface ArticleDetails {
    id: string;
    title: string;
    description: string | null;
    author: string;
    content: string;
    publish_time: string;
    reads_count: number;
    cursor: string;
    next: { id: number; title: string; } | null;
    previous: { id: number; title: string; } | null;
}

export interface ArticleSummaries {
    id: string;
    title: string;
    description: string | null;
    publish_time: string;
}