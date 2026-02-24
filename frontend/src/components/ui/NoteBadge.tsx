import { cn } from "@/lib/utils";
import { NoteType } from "@/types/database";

interface NoteBadgeProps {
    name: string;
    type: NoteType;
    className?: string;
}

export function NoteBadge({ name, type, className }: NoteBadgeProps) {
    const isDominant = type === "Dominant";

    return (
        <div
            className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
                isDominant
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-secondary-foreground border-transparent",
                className
            )}
        >
            {name}
            {isDominant && (
                <span className="ml-1.5 text-[10px] opacity-70 uppercase tracking-wider">
                    ★
                </span>
            )}
        </div>
    );
}
