import { cn } from "@/lib/utils";
import { VerdictType } from "@/types/database";

interface VerdictCardProps {
    verdict: VerdictType;
    summary: string;
    whoItIsFor: string;
    whoShouldAvoid: string;
}

export function VerdictCard({ verdict, summary, whoItIsFor, whoShouldAvoid }: VerdictCardProps) {
    const getVerdictColor = (v: VerdictType) => {
        switch (v) {
            case "Buy": return "bg-green-100 text-green-900 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-900";
            case "Skip": return "bg-red-100 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900";
            case "Situational": return "bg-yellow-100 text-yellow-900 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-900";
            default: return "bg-secondary text-secondary-foreground";
        }
    };

    return (
        <div className="border rounded-xl overflow-hidden">
            <div className={cn("px-6 py-4 border-b font-bold text-lg flex items-center justify-between", getVerdictColor(verdict))}>
                <span>Our Verdict</span>
                <span className="uppercase tracking-wider text-sm">{verdict}</span>
            </div>
            <div className="p-6 space-y-4 bg-card">
                <p className="text-lg leading-relaxed font-medium">
                    {summary}
                </p>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Perfect For</h4>
                        <p className="text-sm">{whoItIsFor}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Avoid If</h4>
                        <p className="text-sm">{whoShouldAvoid}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
