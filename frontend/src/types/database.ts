export type BrandType = 'Designer' | 'Middle Eastern' | 'Niche';
export type Concentration = 'EDT' | 'EDP' | 'Parfum' | 'Extrait' | 'Cologne';
export type PerfumeStatus = 'draft' | 'published';
export type NoteType = 'Top' | 'Middle' | 'Base' | 'Dominant' | 'Supporting';
export type HeatTolerance = 'Low' | 'Medium' | 'High';
export type VerdictType = 'Buy' | 'Skip' | 'Situational';

export interface Brand {
    id: string;
    name: string;
    country: string | null;
    type: BrandType | null;
    created_at: string;
}

export interface Perfume {
    id: string;
    brand_id: string;
    name: string;
    slug: string;
    year: number | null;
    concentration: Concentration | null;
    image_url: string | null;
    status: PerfumeStatus;
    created_at: string;
    // Relations
    brand?: Brand;
    accords?: Accord[];
    notes?: Note[];
    performance?: Performance;
    verdict?: Verdict;
}

export interface Accord {
    id: string;
    perfume_id: string;
    accord_name: string;
    weight: number; // 1-10
}

export interface Note {
    id: string;
    perfume_id: string;
    note_name: string;
    note_type: NoteType;
}

export interface Performance {
    id: string;
    perfume_id: string;
    longevity: string | null;
    projection: string | null;
    heat_tolerance: HeatTolerance | null;
}

export interface Verdict {
    id: string;
    perfume_id: string;
    buy_or_skip: VerdictType | null;
    who_it_is_for: string | null;
    who_should_avoid: string | null;
    summary: string | null;
}
