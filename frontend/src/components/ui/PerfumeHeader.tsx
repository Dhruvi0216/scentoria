import { BrandType, Concentration, PerfumeStatus } from "@/types/database";

interface PerfumeHeaderProps {
    name: string;
    brand: string;
    concentration: Concentration;
    year: number;
    image?: string; // Optional URL
}

export function PerfumeHeader({ name, brand, concentration, year, image }: PerfumeHeaderProps) {
    return (
        <div className="flex gap-6 items-start mb-6">
            <div className="w-24 h-32 bg-secondary rounded-lg shrink-0 flex items-center justify-center text-muted-foreground text-xs overflow-hidden">
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <span>No IMG</span>
                )}
            </div>
            <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                    {brand}
                </h2>
                <h1 className="text-2xl font-bold tracking-tight mb-1">{name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="bg-secondary px-2 py-0.5 rounded text-xs font-medium text-secondary-foreground">
                        {concentration}
                    </span>
                    <span>•</span>
                    <span>{year}</span>
                </div>
            </div>
        </div>
    );
}
