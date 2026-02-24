import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    const supabase: any = createClient();

    try {
        // 1. Check if brand exists
        let { data: brand } = await supabase
            .from('brands')
            .select('id')
            .eq('name', 'Chanel')
            .single();

        if (!brand) {
            const { data: newBrand, error: brandError } = await supabase
                .from('brands')
                .insert({ name: 'Chanel', country: 'France', type: 'Designer' })
                .select('id')
                .single();

            if (brandError) throw brandError;
            brand = newBrand;
        }

        // 2. Insert Perfume
        let { data: perfume } = await supabase
            .from('perfumes')
            .select('id')
            .eq('slug', 'bleu-de-chanel-edp')
            .single();

        if (!perfume) {
            const { data: newPerfume, error: perfumeError } = await supabase
                .from('perfumes')
                .insert({
                    brand_id: brand.id,
                    name: 'Bleu de Chanel',
                    slug: 'bleu-de-chanel-edp',
                    year: 2014,
                    concentration: 'EDP',
                    image_url: 'https://fimgs.fragrantica.com/images/perfume/o.20754.jpg',
                    status: 'published'
                })
                .select('id')
                .single();

            if (perfumeError) throw perfumeError;
            perfume = newPerfume;
        }

        // 3. Insert Accords
        await supabase.from('accords').insert([
            { perfume_id: perfume.id, accord_name: 'Citrus', weight: 90 },
            { perfume_id: perfume.id, accord_name: 'Amber', weight: 80 },
            { perfume_id: perfume.id, accord_name: 'Woody', weight: 75 },
            { perfume_id: perfume.id, accord_name: 'Warm Spicy', weight: 60 },
            { perfume_id: perfume.id, accord_name: 'Aromatic', weight: 50 },
        ]);

        // 4. Insert Notes
        await supabase.from('notes').insert([
            { perfume_id: perfume.id, note_name: 'Grapefruit', note_type: 'Dominant' },
            { perfume_id: perfume.id, note_name: 'Amber', note_type: 'Dominant' },
            { perfume_id: perfume.id, note_name: 'Incense', note_type: 'Dominant' },
            { perfume_id: perfume.id, note_name: 'Ginger', note_type: 'Supporting' },
            { perfume_id: perfume.id, note_name: 'Mint', note_type: 'Supporting' },
        ]);

        // 5. Insert Performance
        await supabase.from('performance').insert({
            perfume_id: perfume.id,
            longevity: '8-10 hrs',
            projection: 'Moderate to Strong',
            heat_tolerance: 'High (ideal for summer nights)'
        });

        // 6. Insert Verdict
        await supabase.from('verdicts').insert({
            perfume_id: perfume.id,
            buy_or_skip: 'Buy',
            summary: 'The ultimate "dumb reach". It smells professional, clean, and high-quality.',
            who_it_is_for: 'Office workers, first-time fragrance buyers.',
            who_should_avoid: 'Niche lovers looking for something unique.'
        });

        return NextResponse.json({ success: true, message: 'Database seeded successfully!' });

    } catch (error: any) {
        console.error('Seed Error Detailed:', error);
        return NextResponse.json(
            {
                error: 'Seed failed',
                details: error?.message || JSON.stringify(error),
                hint: 'Check console logs for full object'
            },
            { status: 500 }
        );
    }
}
