import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { scrapeRedditForPerfume, filterRelevantComments } from '@/lib/reddit/scraper';
import { analyzeCommentsSimple } from '@/lib/ai/analyzer';

export async function POST(request: Request) {
    try {
        const { perfumeId, perfumeName, brandName } = await request.json();

        if (!perfumeId || !perfumeName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase: any = createClient();

        // Create scraping job
        const { data: job, error: jobError } = await supabase
            .from('scraping_jobs')
            .insert({
                perfume_id: perfumeId as string,
                status: 'running' as const,
                started_at: new Date().toISOString()
            } as any)
            .select()
            .single();

        if (jobError || !job) {
            return NextResponse.json(
                { error: 'Failed to create job: ' + (jobError?.message || 'Unknown') },
                { status: 500 }
            );
        }

        try {
            // Step 1: Scrape Reddit
            console.log(`Starting scrape for: ${brandName} ${perfumeName}`);
            const scrapingResult = await scrapeRedditForPerfume(
                `${brandName} ${perfumeName}`
            );

            if (scrapingResult.totalFound === 0) {
                await supabase
                    .from('scraping_jobs')
                    .update({
                        status: 'completed',
                        mentions_found: 0,
                        completed_at: new Date().toISOString(),
                        error_message: 'No mentions found'
                    } as any)
                    .eq('id', job.id);

                return NextResponse.json({
                    success: true,
                    message: 'No Reddit mentions found',
                    mentionsFound: 0
                });
            }

            // Step 2: Filter relevant comments
            const relevantComments = filterRelevantComments(
                scrapingResult.comments,
                perfumeName
            );

            // Step 3: Store in database
            const commentTexts: string[] = [];

            for (const comment of relevantComments) {
                await supabase.from('reddit_mentions').insert({
                    perfume_id: perfumeId,
                    post_title: comment.postTitle,
                    post_url: comment.postUrl,
                    subreddit: comment.subreddit,
                    comment_text: comment.text,
                    comment_author: comment.author,
                    comment_permalink: comment.permalink,
                    upvotes: comment.upvotes,
                    created_at: comment.created.toISOString()
                });

                commentTexts.push(comment.text);
            }

            // Step 4: Run AI analysis
            const analysis = analyzeCommentsSimple(commentTexts);

            // Step 5: Store analysis
            await supabase.from('ai_analysis').insert({
                perfume_id: perfumeId,
                overall_sentiment: analysis.sentiment,
                confidence_score: analysis.confidence,
                occasions: analysis.occasions,
                best_seasons: analysis.seasons,
                compliment_factor: analysis.complimentFactor,
                avg_longevity_hours: analysis.longevity,
                avg_projection: analysis.projection,
                value_rating: analysis.valueRating,
                pros: analysis.pros,
                cons: analysis.cons,
                similar_fragrances: analysis.similarFragrances,
                total_mentions: relevantComments.length
            });

            // Step 6: Update perfume metadata
            await supabase
                .from('perfumes')
                .update({
                    last_scraped_at: new Date().toISOString(),
                    reddit_mention_count: relevantComments.length,
                    community_rating: analysis.sentiment
                })
                .eq('id', perfumeId);

            // Step 7: Complete job
            await supabase
                .from('scraping_jobs')
                .update({
                    status: 'completed',
                    mentions_found: relevantComments.length,
                    completed_at: new Date().toISOString()
                } as any)
                .eq('id', job.id);

            return NextResponse.json({
                success: true,
                mentionsFound: relevantComments.length,
                sentiment: analysis.sentiment,
                analysis
            });

        } catch (error) {
            // Update job as failed
            await supabase
                .from('scraping_jobs')
                .update({
                    status: 'failed',
                    error_message: error instanceof Error ? error.message : 'Unknown error',
                    completed_at: new Date().toISOString()
                } as any)
                .eq('id', job.id);

            throw error;
        }

    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Scraping failed' },
            { status: 500 }
        );
    }
}

// GET endpoint to check scraping status
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const perfumeId = searchParams.get('perfumeId');

    if (!perfumeId) {
        return NextResponse.json({ error: 'Missing perfumeId' }, { status: 400 });
    }

    const supabase: any = createClient();

    const { data: job } = await supabase
        .from('scraping_jobs')
        .select('*')
        .eq('perfume_id', perfumeId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    return NextResponse.json({ job });
}
