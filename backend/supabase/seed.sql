
INSERT INTO brands (name, country, type)
VALUES ('Chanel', 'France', 'Designer')
ON CONFLICT (name) DO NOTHING;


WITH brand_id AS (SELECT id FROM brands WHERE name = 'Chanel' LIMIT 1)
INSERT INTO perfumes (brand_id, name, slug, year, concentration, image_url, status)
SELECT 
    id, 
    'Bleu de Chanel', 
    'bleu-de-chanel-edp', 
    2014, 
    'EDP', 
    'https://fimgs.fragrantica.com/images/perfume/o.20754.jpg', 
    'published'
FROM brand_id
ON CONFLICT (slug) DO NOTHING;


WITH perfume_curr AS (SELECT id FROM perfumes WHERE slug = 'bleu-de-chanel-edp' LIMIT 1)
INSERT INTO accords (perfume_id, accord_name, weight)
SELECT id, 'Citrus', 90 FROM perfume_curr
UNION ALL SELECT id, 'Amber', 80 FROM perfume_curr
UNION ALL SELECT id, 'Woody', 75 FROM perfume_curr
UNION ALL SELECT id, 'Warm Spicy', 60 FROM perfume_curr
UNION ALL SELECT id, 'Aromatic', 50 FROM perfume_curr;

-- Insert Notes
WITH perfume_curr AS (SELECT id FROM perfumes WHERE slug = 'bleu-de-chanel-edp' LIMIT 1)
INSERT INTO notes (perfume_id, note_name, note_type)
SELECT id, 'Grapefruit', 'Dominant' FROM perfume_curr
UNION ALL SELECT id, 'Amber', 'Dominant' FROM perfume_curr
UNION ALL SELECT id, 'Incense', 'Dominant' FROM perfume_curr
UNION ALL SELECT id, 'Ginger', 'Supporting' FROM perfume_curr
UNION ALL SELECT id, 'Mint', 'Supporting' FROM perfume_curr;

-- Insert Performance
WITH perfume_curr AS (SELECT id FROM perfumes WHERE slug = 'bleu-de-chanel-edp' LIMIT 1)
INSERT INTO performance (perfume_id, longevity, projection, heat_tolerance)
SELECT id, '8-10 hrs', 'Moderate to Strong', 'High (ideal for summer nights)' FROM perfume_curr;

-- Insert Verdict
WITH perfume_curr AS (SELECT id FROM perfumes WHERE slug = 'bleu-de-chanel-edp' LIMIT 1)
INSERT INTO verdicts (perfume_id, buy_or_skip, summary, who_it_is_for, who_should_avoid)
SELECT 
    id, 
    'Buy', 
    'The ultimate "dumb reach". It smells professional, clean, and high-quality.', 
    'Office workers, first-time fragrance buyers, and men who want one scent for everything.', 
    'Niche lovers looking for something unique or challenging.' 
FROM perfume_curr;
