'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, CheckCircleIcon, XCircleIcon, SearchIcon, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ScrapingJob {
    id: string; // This is the PERFUME ID
    perfumeName: string;
    status: 'idle' | 'running' | 'success' | 'error';
    mentionsFound?: number;
    error?: string;
    lastScraped?: string;
    mentionCount?: number;
}

export default function AdminScrapePage() {
    const [jobs, setJobs] = useState<ScrapingJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const supabase = createClient();

    useEffect(() => {
        fetchPerfumes();
    }, []);

    const fetchPerfumes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('perfumes')
                .select('id, name, last_scraped_at, reddit_mention_count')
                .eq('status', 'published')
                .order('name'); // Assuming brand is separate in a real app, but name is fine

            if (error) throw error;

            if (data) {
                const initialJobs: ScrapingJob[] = (data as any[]).map(p => ({
                    id: p.id,
                    perfumeName: p.name,
                    status: 'idle',
                    lastScraped: p.last_scraped_at,
                    mentionCount: p.reddit_mention_count
                }));
                setJobs(initialJobs);
            }
        } catch (err) {
            console.error('Error fetching perfumes:', err);
        } finally {
            setLoading(false);
        }
    };

    const runScraping = async (perfumeId: string, perfumeName: string) => {
        // Update status to running
        setJobs(prev => prev.map(job =>
            job.id === perfumeId ? { ...job, status: 'running' as const } : job
        ));

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    perfumeId,
                    perfumeName,
                    brandName: perfumeName.split(' ')[0] // Simple brand extraction (better in backend, but ok for MVP)
                })
            });

            const data = await response.json();

            if (data.success) {
                setJobs(prev => prev.map(job =>
                    job.id === perfumeId
                        ? {
                            ...job,
                            status: 'success' as const,
                            mentionsFound: data.mentionsFound,
                            mentionCount: data.mentionsFound // update optimistic
                        }
                        : job
                ));
            } else {
                throw new Error(data.error || 'Unknown API error');
            }
        } catch (error) {
            setJobs(prev => prev.map(job =>
                job.id === perfumeId
                    ? { ...job, status: 'error' as const, error: error instanceof Error ? error.message : 'Unknown error' }
                    : job
            ));
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.perfumeName.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Reddit Scraping Manager</h1>

            <div className="mb-8 p-6 bg-card border border-border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Select Perfume to Scrape</h2>
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search database..."
                        className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Note: Shows all published perfumes from your database.
                </p>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-lg border border-dashed text-muted-foreground">
                        No perfumes found matching "{filter}".
                    </div>
                ) : (
                    filteredJobs.map(job => (
                        <div
                            key={job.id}
                            className="p-6 bg-card border border-border rounded-lg shadow-sm flex items-center justify-between"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">{job.perfumeName}</h3>
                                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                    {job.lastScraped && (
                                        <span>Last scraped: {new Date(job.lastScraped).toLocaleDateString()}</span>
                                    )}
                                    {job.mentionCount !== undefined && job.mentionCount > 0 && (
                                        <span>{job.mentionCount} mentions stored</span>
                                    )}
                                </div>

                                {job.status === 'success' && (
                                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                        <CheckCircleIcon className="w-3 h-3" /> Found {job.mentionsFound} Reddit mentions
                                    </p>
                                )}
                                {job.status === 'error' && (
                                    <p className="text-sm text-destructive mt-2 flex items-center gap-1">
                                        <XCircleIcon className="w-3 h-3" /> Error: {job.error}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {job.status === 'idle' && (
                                    <button
                                        onClick={() => runScraping(job.id, job.perfumeName)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <PlayIcon className="w-4 h-4" />
                                        Start
                                    </button>
                                )}

                                {job.status === 'running' && (
                                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                                        Scraping...
                                    </div>
                                )}

                                {job.status === 'success' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => runScraping(job.id, job.perfumeName)}
                                            className="text-xs px-2 py-1 bg-secondary hover:bg-muted transition-colors rounded"
                                        >
                                            Re-run
                                        </button>
                                        <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                    </div>
                                )}

                                {job.status === 'error' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => runScraping(job.id, job.perfumeName)}
                                            className="text-xs px-2 py-1 bg-secondary hover:bg-muted transition-colors rounded"
                                        >
                                            Retry
                                        </button>
                                        <XCircleIcon className="w-6 h-6 text-destructive" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
