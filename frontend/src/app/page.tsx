import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Using dynamic rendering for now to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase: any = createClient();

  const { data: perfumes } = await supabase
    .from("perfumes")
    .select(`
      *,
      brand:brands(name),
      verdict:verdicts(buy_or_skip)
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12 max-w-2xl mx-auto text-center pt-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Fragrance reviews, <br />
          <span className="text-muted-foreground">simplified.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          No fluff. Honest verdicts. Indian climate focused.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="section-title">
          Latest Reviews
        </h2>

        {!perfumes || perfumes.length === 0 ? (
          <div className="p-8 border border-dashed rounded-lg text-muted-foreground">
            No perfumes found. Add some in Supabase!
          </div>
        ) : (
          <div className="space-y-4">
            {perfumes.map((p: any) => (
              <Link
                key={p.id}
                href={`/perfume/${p.slug}`}
                className="block group border rounded-xl overflow-hidden hover:border-primary transition-colors text-left bg-card"
              >
                <div className="flex h-32">
                  <div className="w-24 bg-secondary shrink-0 flex items-center justify-center relative overflow-hidden">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-muted-foreground">IMG</span>
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {p.brand?.name}
                    </div>
                    <h3 className="text-xl font-bold group-hover:underline decoration-2 underline-offset-4">
                      {p.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      {p.verdict?.buy_or_skip && (
                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${p.verdict.buy_or_skip === 'Buy' ? 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300' :
                          p.verdict.buy_or_skip === 'Skip' ? 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300' :
                            'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                          {p.verdict.buy_or_skip}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {p.concentration}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
