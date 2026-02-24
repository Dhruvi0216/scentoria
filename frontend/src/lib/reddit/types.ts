export interface RedditComment {
    id: string;
    text: string;
    author: string;
    upvotes: number;
    created: Date;
    permalink: string;
    subreddit: string;
    postTitle: string;
    postUrl: string;
}

export interface ScrapingResult {
    comments: RedditComment[];
    totalFound: number;
    subredditsSearched: string[];
    errors: string[];
}
