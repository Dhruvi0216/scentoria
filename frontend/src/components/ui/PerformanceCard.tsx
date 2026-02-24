import { HeatTolerance } from "@/types/database";

interface PerformanceCardProps {
    longevity: string;
    projection: string;
    heatTolerance: HeatTolerance;
}

export function PerformanceCard({ longevity, projection, heatTolerance }: PerformanceCardProps) {
    return (
        <div className="grid grid-cols-3 gap-4 border rounded-lg p-4 bg-card text-center">
            <div className="space-y-1">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wide">Longevity</h4>
                <p className="font-semibold text-sm">{longevity}</p>
            </div>
            <div className="space-y-1 border-x border-input px-2">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wide">Projection</h4>
                <p className="font-semibold text-sm">{projection}</p>
            </div>
            <div className="space-y-1">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wide">Heat Tolerance</h4>
                <p className="font-semibold text-sm">{heatTolerance}</p>
            </div>
        </div>
    );
}
