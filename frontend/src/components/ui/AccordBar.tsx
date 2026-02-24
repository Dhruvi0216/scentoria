import { cn } from "@/lib/utils";

interface AccordBarProps {
    name: string;
    weight: number; // 1-10
    className?: string;
}

export function AccordBar({ name, weight, className }: AccordBarProps) {
    // Normalize weight to percentage (10 = 100%)
    const percentage = Math.min(Math.max(weight * 10, 10), 100);

    return (
        <div className={cn("flex items-center gap-3 text-sm", className)}>
            <span className="w-24 font-medium truncate shrink-0" title={name}>
                {name}
            </span>
            <div className="flex-1 h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-foreground rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-xs text-muted-foreground w-6 text-right">
                {weight}
            </span>
        </div>
    );
}
