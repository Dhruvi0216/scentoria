import { PerfumeHeader } from "@/components/ui/PerfumeHeader";
import { AccordBar } from "@/components/ui/AccordBar";
import { PerformanceCard } from "@/components/ui/PerformanceCard";
import { NoteBadge } from "@/components/ui/NoteBadge";
import { VerdictCard } from "@/components/ui/VerdictCard";
import CommunityCard from "@/components/ui/CommunityCard"; // Import CommunityCard
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

// Next.js 15/13+ App Router page props
type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const supabase: any = createClient();

    const { data: perfume } = await supabase
        .from("perfumes")
        .select("name, brand:brands(name)")
        .eq("slug", slug)
        .single();

    if (!perfume) return { title: "Perfume Not Found" };

    return {
        title: `${perfume.name} by ${(perfume.brand as any)?.name} Review | Scentoria`,
        description: `Honest review of ${perfume.name}. Performance, notes, and community verdict.`
    };
}

export default async function PerfumePage(props: Props) {
    const params = await props.params;
    const { slug } = params;
    const supabase: any = createClient();

    // Fetch all data in parallel or via joined query
    // For simplicity and depth, we'll do a big join
    const { data: perfume } = await supabase
        .from("perfumes")
        .select(`
      *,
      brand:brands(*),
      accords(*),
      notes(*),
      performance(*),
      verdict:verdicts(*),
      ai_analysis(*),
      reddit_mentions(comment_text, comment_author, upvotes, comment_permalink)
    `)
        .eq("slug", slug)
        .single();

    if (!perfume) {
        return notFound();
    }

    // Typecasting for easy access (supabase types can be complex with joins)
    const brand = perfume.brand as any;
    const accords = (perfume.accords as any[])?.sort((a, b) => b.weight - a.weight) || [];
    const notes = (perfume.notes as any[]) || [];
    const performance = (perfume.performance as any[])?.[0] || {}; // One-to-one is array in supbase join usually
    const verdict = (perfume.verdict as any[])?.[0] || {};
    const aiAnalysis = (perfume.ai_analysis as any[])?.[0]; // Can be undefined if not scraped
    const mentions = (perfume.reddit_mentions as any[]) || [];

    const dominantNotes = notes.filter(n => n.note_type === "Dominant");
    const supportingNotes = notes.filter(n => n.note_type !== "Dominant");

    // Format top comments for Community Card
    const topComments = mentions
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
        .slice(0, 3)
        .map(m => ({
            text: m.comment_text,
            author: m.comment_author || 'deleted',
            upvotes: m.upvotes || 0,
            url: m.comment_permalink || '#'
        }));

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            {/* 1. Header */}
            <PerfumeHeader
                name={perfume.name}
                brand={brand?.name}
                concentration={perfume.concentration!}
                year={perfume.year!}
                image={perfume.image_url || undefined}
            />

            {/* 2. Main Accords */}
            {accords.length > 0 && (
                <section>
                    <h3 className="section-title mb-3">Main Accords</h3>
                    <div className="space-y-2">
                        {accords.map(accord => (
                            <AccordBar
                                key={accord.id}
                                name={accord.accord_name}
                                weight={accord.weight}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 3. Quick Summary */}
            {verdict.summary && (
                <div className="text-center py-4 px-6 bg-secondary/30 rounded-lg italic text-muted-foreground">
                    "{verdict.summary.split('.')[0]}."
                </div>
            )}

            {/* 4. Performance */}
            {performance.id && (
                <section>
                    <h3 className="section-title mb-3">Performance</h3>
                    <PerformanceCard
                        longevity={performance.longevity || "Unknown"}
                        projection={performance.projection || "Unknown"}
                        heatTolerance={performance.heat_tolerance || "Medium"}
                    />
                </section>
            )}

            {/* 5. Notes */}
            {notes.length > 0 && (
                <section>
                    <h3 className="section-title mb-3">Notes</h3>
                    <div className="space-y-4">
                        {dominantNotes.length > 0 && (
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Dominant</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {dominantNotes.map(note => (
                                        <NoteBadge key={note.id} name={note.note_name} type="Dominant" />
                                    ))}
                                </div>
                            </div>
                        )}
                        {supportingNotes.length > 0 && (
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Supporting</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {supportingNotes.map(note => (
                                        <NoteBadge key={note.id} name={note.note_name} type="Supporting" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* 6. Community Consensus (NEW) */}
            {aiAnalysis ? (
                <section>
                    <CommunityCard
                        sentiment={aiAnalysis.overall_sentiment || 5}
                        totalMentions={aiAnalysis.total_mentions || 0}
                        occasions={(aiAnalysis.occasions as string[]) || []}
                        complimentFactor={aiAnalysis.compliment_factor || 'Medium'}
                        pros={(aiAnalysis.pros as string[]) || []}
                        cons={(aiAnalysis.cons as string[]) || []}
                        topComments={topComments}
                    />
                </section>
            ) : (
                <section>
                    <h3 className="section-title mb-3">Community Consensus</h3>
                    <div className="p-6 border border-dashed rounded-xl text-center text-muted-foreground">
                        <p className="mb-2">No community data yet.</p>
                        <p className="text-xs">Go to Admin Dashboard to scrape Reddit for this perfume.</p>
                    </div>
                </section>
            )}

            {/* 7. Verdict (Manual) */}
            {verdict.id && (
                <section>
                    <VerdictCard
                        verdict={verdict.buy_or_skip!}
                        summary={verdict.summary || ""}
                        whoItIsFor={verdict.who_it_is_for || ""}
                        whoShouldAvoid={verdict.who_should_avoid || ""}
                    />
                </section>
            )}
        </div>
    );
}
