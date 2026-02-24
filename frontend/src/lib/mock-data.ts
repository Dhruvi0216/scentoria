import { Perfume, Accord, Note, Performance, Verdict } from "@/types/database";

export const MOCK_PERFUME = {
    id: "1",
    brand: { id: "b1", name: "Chanel", country: "France", type: "Designer", created_at: "" },
    perfume: {
        id: "p1",
        brand_id: "b1",
        name: "Bleu de Chanel",
        slug: "bleu-de-chanel-edp",
        year: 2014,
        concentration: "EDP",
        status: "published",
        created_at: "",
        image_url: "https://fimgs.net/mdimg/perfume/375x500.25967.jpg" // Placeholder or empty
    } as Perfume,
    accords: [
        { id: "a1", perfume_id: "p1", accord_name: "Amber", weight: 9 },
        { id: "a2", perfume_id: "p1", accord_name: "Citrus", weight: 8 },
        { id: "a3", perfume_id: "p1", accord_name: "Woody", weight: 7 },
        { id: "a4", perfume_id: "p1", accord_name: "Aromatic", weight: 6 },
        { id: "a5", perfume_id: "p1", accord_name: "Warm Spicy", weight: 5 },
    ] as Accord[],
    notes: [
        { id: "n1", perfume_id: "p1", note_name: "Grapefruit", note_type: "Dominant" },
        { id: "n2", perfume_id: "p1", note_name: "Amber", note_type: "Dominant" },
        { id: "n3", perfume_id: "p1", note_name: "Ginger", note_type: "Dominant" },
        { id: "n4", perfume_id: "p1", note_name: "Mint", note_type: "Supporting" },
        { id: "n5", perfume_id: "p1", note_name: "Jasmine", note_type: "Supporting" },
        { id: "n6", perfume_id: "p1", note_name: "Sandalwood", note_type: "Supporting" },
    ] as Note[],
    performance: {
        id: "pe1",
        perfume_id: "p1",
        longevity: "7-9 Hours",
        projection: "Moderate",
        heat_tolerance: "High"
    } as Performance,
    verdict: {
        id: "v1",
        perfume_id: "p1",
        buy_or_skip: "Buy",
        who_it_is_for: "The professional man who wants to smell clean, confident, and sophisticated without trying too hard.",
        who_should_avoid: "Someone looking for a unique, niche, or artistic statement scent. This is mass-appealing.",
        summary: "The ultimate dumb reach. It works in the office, on a date, or at the gym. It smells expensive, clean, and masculine. You can't go wrong."
    } as Verdict
};
