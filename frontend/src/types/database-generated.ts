export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            brands: {
                Row: {
                    id: string
                    name: string
                    country: string | null
                    type: 'Designer' | 'Middle Eastern' | 'Niche' | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    country?: string | null
                    type?: 'Designer' | 'Middle Eastern' | 'Niche' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    country?: string | null
                    type?: 'Designer' | 'Middle Eastern' | 'Niche' | null
                    created_at?: string
                }
            }
            perfumes: {
                Row: {
                    id: string
                    brand_id: string
                    name: string
                    slug: string
                    year: number | null
                    concentration: 'EDT' | 'EDP' | 'Parfum' | 'Extrait' | 'Cologne' | null
                    image_url: string | null
                    status: 'draft' | 'published' | null
                    created_at: string
                    last_scraped_at: string | null
                    reddit_mention_count: number | null
                    community_rating: number | null
                }
                Insert: {
                    id?: string
                    brand_id: string
                    name: string
                    slug: string
                    year?: number | null
                    concentration?: 'EDT' | 'EDP' | 'Parfum' | 'Extrait' | 'Cologne' | null
                    image_url?: string | null
                    status?: 'draft' | 'published' | null
                    created_at?: string
                    last_scraped_at?: string | null
                    reddit_mention_count?: number | null
                    community_rating?: number | null
                }
                Update: {
                    id?: string
                    brand_id?: string
                    name?: string
                    slug?: string
                    year?: number | null
                    concentration?: 'EDT' | 'EDP' | 'Parfum' | 'Extrait' | 'Cologne' | null
                    image_url?: string | null
                    status?: 'draft' | 'published' | null
                    created_at?: string
                    last_scraped_at?: string | null
                    reddit_mention_count?: number | null
                    community_rating?: number | null
                }
            }
            reddit_mentions: {
                Row: {
                    id: string
                    perfume_id: string
                    post_title: string | null
                    post_url: string | null
                    subreddit: string | null
                    comment_text: string
                    comment_author: string | null
                    comment_permalink: string | null
                    upvotes: number | null
                    scraped_at: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    perfume_id: string
                    post_title?: string | null
                    post_url?: string | null
                    subreddit?: string | null
                    comment_text: string
                    comment_author?: string | null
                    comment_permalink?: string | null
                    upvotes?: number | null
                    scraped_at?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    perfume_id?: string
                    post_title?: string | null
                    post_url?: string | null
                    subreddit?: string | null
                    comment_text?: string
                    comment_author?: string | null
                    comment_permalink?: string | null
                    upvotes?: number | null
                    scraped_at?: string | null
                    created_at?: string | null
                }
            }
            ai_analysis: {
                Row: {
                    id: string
                    perfume_id: string
                    overall_sentiment: number | null
                    confidence_score: number | null
                    occasions: Json | null
                    best_seasons: Json | null
                    compliment_factor: 'High' | 'Medium' | 'Low' | null
                    avg_longevity_hours: number | null
                    avg_projection: number | null
                    avg_sillage: number | null
                    value_rating: 'Bargain' | 'Fair' | 'Overpriced' | null
                    similar_fragrances: Json | null
                    pros: Json | null
                    cons: Json | null
                    total_mentions: number | null
                    analyzed_at: string | null
                    analysis_version: string | null
                }
                Insert: {
                    id?: string
                    perfume_id: string
                    overall_sentiment?: number | null
                    confidence_score?: number | null
                    occasions?: Json | null
                    best_seasons?: Json | null
                    compliment_factor?: 'High' | 'Medium' | 'Low' | null
                    avg_longevity_hours?: number | null
                    avg_projection?: number | null
                    avg_sillage?: number | null
                    value_rating?: 'Bargain' | 'Fair' | 'Overpriced' | null
                    similar_fragrances?: Json | null
                    pros?: Json | null
                    cons?: Json | null
                    total_mentions?: number | null
                    analyzed_at?: string | null
                    analysis_version?: string | null
                }
                Update: {
                    id?: string
                    perfume_id?: string
                    overall_sentiment?: number | null
                    confidence_score?: number | null
                    occasions?: Json | null
                    best_seasons?: Json | null
                    compliment_factor?: 'High' | 'Medium' | 'Low' | null
                    avg_longevity_hours?: number | null
                    avg_projection?: number | null
                    avg_sillage?: number | null
                    value_rating?: 'Bargain' | 'Fair' | 'Overpriced' | null
                    similar_fragrances?: Json | null
                    pros?: Json | null
                    cons?: Json | null
                    total_mentions?: number | null
                    analyzed_at?: string | null
                    analysis_version?: string | null
                }
            }
            scraping_jobs: {
                Row: {
                    id: string
                    perfume_id: string | null
                    status: 'pending' | 'running' | 'completed' | 'failed' | null
                    error_message: string | null
                    mentions_found: number | null
                    started_at: string | null
                    completed_at: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    perfume_id?: string | null
                    status?: 'pending' | 'running' | 'completed' | 'failed' | null
                    error_message?: string | null
                    mentions_found?: number | null
                    started_at?: string | null
                    completed_at?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    perfume_id?: string | null
                    status?: 'pending' | 'running' | 'completed' | 'failed' | null
                    error_message?: string | null
                    mentions_found?: number | null
                    started_at?: string | null
                    completed_at?: string | null
                    created_at?: string | null
                }
            }
        }
    }
}
