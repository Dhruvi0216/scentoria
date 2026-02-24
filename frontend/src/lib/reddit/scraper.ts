import { RedditComment, ScrapingResult } from './types';

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Scrapes Reddit using FREE public JSON endpoints (no API key needed)
 * Rate limit: 2 seconds between requests to be respectful
 */
export async function scrapeRedditForPerfume(
    perfumeName: string,
    options: {
        subreddits?: string[];
        maxPostsPerSub?: number;
        maxCommentsPerPost?: number;
    } = {}
): Promise<ScrapingResult> {

    const {
        subreddits = ['fragrance', 'Perfumes', 'DesiFragranceAddicts', 'FemFragLab'],
        maxPostsPerSub = 25,
        maxCommentsPerPost = 50
    } = options;

    const result: ScrapingResult = {
        comments: [],
        totalFound: 0,
        subredditsSearched: [],
        errors: []
    };

    for (const subreddit of subreddits) {
        console.log(`🔍 Searching r/${subreddit} for "${perfumeName}"...`);

        try {
            // Reddit's FREE public JSON endpoint
            const searchUrl = `https://www.reddit.com/r/${subreddit}/search.json?` +
                `q=${encodeURIComponent(perfumeName)}&` +
                `restrict_sr=1&` +
                `sort=relevance&` +
                `limit=${maxPostsPerSub}`;

            const response = await fetch(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; FragranceBot/1.0)'
                }
            });

            if (!response.ok) {
                result.errors.push(`Failed to search r/${subreddit}: ${response.status}`);
                continue;
            }

            const data = await response.json();
            const posts = data.data?.children || [];

            console.log(`  Found ${posts.length} posts in r/${subreddit}`);

            for (const post of posts) {
                // Wait 2 seconds between requests (be nice to Reddit)
                await sleep(2000);

                const postData = post.data;
                const commentsUrl = `https://www.reddit.com${postData.permalink}.json?limit=${maxCommentsPerPost}`;

                try {
                    const commentsResponse = await fetch(commentsUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (compatible; FragranceBot/1.0)'
                        }
                    });

                    if (!commentsResponse.ok) continue;

                    const commentsJson = await commentsResponse.json();
                    const commentsList = commentsJson[1]?.data?.children || [];

                    for (const commentObj of commentsList) {
                        if (commentObj.kind !== 't1') continue; // Skip non-comments

                        const comment = commentObj.data;

                        // Skip deleted/removed comments
                        if (!comment.body || comment.body === '[deleted]' || comment.body === '[removed]') {
                            continue;
                        }

                        // Only include substantial comments (>20 chars)
                        if (comment.body.length < 20) continue;

                        result.comments.push({
                            id: comment.id,
                            text: comment.body,
                            author: comment.author,
                            upvotes: comment.ups || 0,
                            created: new Date(comment.created_utc * 1000),
                            permalink: `https://reddit.com${comment.permalink}`,
                            subreddit: subreddit,
                            postTitle: postData.title,
                            postUrl: `https://reddit.com${postData.permalink}`
                        });
                    }

                } catch (error) {
                    console.error(`  Error fetching comments for post ${postData.id}:`, error);
                }
            }

            result.subredditsSearched.push(subreddit);
            console.log(`  ✅ Collected ${result.comments.length} total comments so far`);

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            result.errors.push(`r/${subreddit}: ${errorMsg}`);
            console.error(`  ❌ Error in r/${subreddit}:`, error);
        }
    }

    result.totalFound = result.comments.length;
    console.log(`\n✅ Scraping complete: ${result.totalFound} comments from ${result.subredditsSearched.length} subreddits`);

    return result;
}

/**
 * Filter comments to find the most relevant ones
 */
export function filterRelevantComments(
    comments: RedditComment[],
    perfumeName: string
): RedditComment[] {
    const searchTerms = perfumeName.toLowerCase().split(' ');

    return comments
        .filter(comment => {
            const text = comment.text.toLowerCase();
            // Must mention at least part of the perfume name
            return searchTerms.some(term => text.includes(term));
        })
        .sort((a, b) => b.upvotes - a.upvotes) // Sort by upvotes
        .slice(0, 200); // Keep top 200 most relevant
}
