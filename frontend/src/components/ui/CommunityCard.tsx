import { MessageCircleIcon, TrendingUpIcon } from 'lucide-react';

interface CommunityCardProps {
    sentiment: number; // 0-10
    totalMentions: number;
    occasions: string[];
    complimentFactor: 'High' | 'Medium' | 'Low';
    pros: string[];
    cons: string[];
    topComments?: Array<{
        text: string;
        author: string;
        upvotes: number;
        url: string;
    }>;
}

export default function CommunityCard({
    sentiment,
    totalMentions,
    occasions,
    complimentFactor,
    pros,
    cons,
    topComments = []
}: CommunityCardProps) {

    const getRecommendation = (score: number) => {
        if (score >= 8) return { text: 'Highly Recommended', color: 'text-green-600' };
        if (score >= 6) return { text: 'Generally Liked', color: 'text-blue-600' };
        if (score >= 4) return { text: 'Mixed Reviews', color: 'text-yellow-600' };
        return { text: 'Proceed with Caution', color: 'text-red-600' };
    };

    const recommendation = getRecommendation(sentiment);

    return (
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl border border-white/10 p-8 text-zinc-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <MessageCircleIcon className="w-5 h-5 text-blue-400" />
                    What Reddit Says
                </h2>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                    {totalMentions.toLocaleString()} mentions
                </div>
            </div>

            {/* Sentiment Meter */}
            <div className="mb-8 p-6 bg-black/20 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                        Community Rating
                    </span>
                    <span className={`text-3xl font-bold ${recommendation.color}`}>
                        {sentiment.toFixed(1)}/10
                    </span>
                </div>

                <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden mb-3">
                    <div
                        className="absolute h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${sentiment * 10}%` }}
                    />
                </div>

                <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                    <span>Skip</span>
                    <span className={recommendation.color}>{recommendation.text}</span>
                    <span>Must Buy</span>
                </div>
            </div>

            {/* Occasions */}
            {occasions.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                        Best For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {occasions.map((occasion, idx) => (
                            <span
                                key={idx}
                                className="px-4 py-1.5 bg-zinc-800 text-zinc-200 border border-zinc-700/50 rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
                            >
                                {occasion}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Compliment Factor */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                    Compliment Factor
                </h3>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${complimentFactor === 'High' ? 'bg-emerald-500/10 text-emerald-400' :
                            complimentFactor === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-zinc-500/10 text-zinc-400'
                        }`}>
                        <TrendingUpIcon className="w-5 h-5" />
                    </div>
                    <span className={`text-lg font-semibold ${complimentFactor === 'High' ? 'text-emerald-400' :
                            complimentFactor === 'Medium' ? 'text-amber-400' :
                                'text-zinc-400'
                        }`}>{complimentFactor}</span>
                </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                {/* Pros */}
                {pros.length > 0 && (
                    <div className="bg-emerald-950/20 rounded-lg p-5 border border-emerald-900/30">
                        <h3 className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                            <span className="text-lg leading-none">☺</span> Pros
                        </h3>
                        <ul className="space-y-3">
                            {pros.map((pro, idx) => (
                                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2.5 leading-relaxed">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Cons */}
                {cons.length > 0 && (
                    <div className="bg-red-950/20 rounded-lg p-5 border border-red-900/30">
                        <h3 className="text-xs font-bold text-red-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                            <span className="text-lg leading-none">☹</span> Cons
                        </h3>
                        <ul className="space-y-3">
                            {cons.map((con, idx) => (
                                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2.5 leading-relaxed">
                                    <span className="text-red-500 mt-1">•</span>
                                    {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Top Comments */}
            {topComments.length > 0 && (
                <div className="pt-6 border-t border-white/5">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                        Top Comments
                    </h3>
                    <div className="space-y-3">
                        {topComments.slice(0, 3).map((comment, idx) => (
                            <a
                                key={idx}
                                href={comment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 bg-zinc-800/50 border border-zinc-700/30 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 transition-all group"
                            >
                                <p className="text-sm text-zinc-300 mb-3 line-clamp-2 italic group-hover:text-zinc-100 transition-colors">
                                    "{comment.text}"
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-wide">
                                    <span className="text-zinc-400">u/{comment.author}</span>
                                    <span className="flex items-center gap-1 font-bold text-zinc-400 group-hover:text-blue-400 transition-colors">
                                        ▲ {comment.upvotes}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Data Source */}
            <div className="mt-8 pt-4 text-center">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                    Aggregated from r/fragrance • r/Perfumes • r/DesiFragranceAddicts
                </p>
            </div>
        </div>
    );
}
