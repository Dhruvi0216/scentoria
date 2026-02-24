-- ============================================
-- REDDIT MENTIONS TABLE
-- ============================================
CREATE TABLE if not exists reddit_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  
  -- Post info
  post_title TEXT,
  post_url TEXT,
  subreddit VARCHAR(50),
  
  -- Comment info
  comment_text TEXT NOT NULL,
  comment_author VARCHAR(50),
  comment_permalink TEXT,
  upvotes INTEGER DEFAULT 0,
  
  -- Metadata
  scraped_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP,
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', comment_text)
  ) STORED
);

CREATE INDEX if not exists idx_reddit_perfume ON reddit_mentions(perfume_id);
CREATE INDEX if not exists idx_reddit_search ON reddit_mentions USING GIN(search_vector);

-- ============================================
-- AI ANALYSIS TABLE
-- ============================================
CREATE TABLE if not exists ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  
  -- Sentiment scores
  overall_sentiment FLOAT CHECK (overall_sentiment BETWEEN 0 AND 10),
  confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
  
  -- Usage insights
  occasions JSONB, -- ["Office", "Date Night", "Summer"]
  best_seasons JSONB, -- ["Spring", "Fall"]
  compliment_factor TEXT CHECK (compliment_factor IN ('High', 'Medium', 'Low')),
  
  -- Performance from Reddit
  avg_longevity_hours FLOAT,
  avg_projection INTEGER CHECK (avg_projection BETWEEN 1 AND 10),
  avg_sillage INTEGER CHECK (avg_sillage BETWEEN 1 AND 10),
  
  -- Value analysis
  value_rating TEXT CHECK (value_rating IN ('Bargain', 'Fair', 'Overpriced')),
  
  -- Comparisons
  similar_fragrances JSONB, -- ["Sauvage", "Dior Homme"]
  
  -- Pros & Cons
  pros JSONB, -- ["Versatile", "Long lasting"]
  cons JSONB, -- ["Generic", "Expensive"]
  
  -- Source tracking
  total_mentions INTEGER DEFAULT 0,
  analyzed_at TIMESTAMP DEFAULT NOW(),
  analysis_version VARCHAR(10) DEFAULT '1.0'
);

CREATE INDEX if not exists idx_ai_perfume ON ai_analysis(perfume_id);
CREATE INDEX if not exists idx_ai_sentiment ON ai_analysis(overall_sentiment DESC);

-- ============================================
-- SEARCH CACHE TABLE (Performance)
-- ============================================
CREATE TABLE if not exists search_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash TEXT UNIQUE NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '1 hour'
);

CREATE INDEX if not exists idx_cache_expiry ON search_cache(expires_at);

-- ============================================
-- SCRAPING JOBS TABLE (For admin)
-- ============================================
CREATE TABLE if not exists scraping_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfume_id UUID REFERENCES perfumes(id),
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  error_message TEXT,
  mentions_found INTEGER DEFAULT 0,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX if not exists idx_jobs_status ON scraping_jobs(status);

-- ============================================
-- UPDATE EXISTING PERFUMES TABLE
-- ============================================
ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS 
  last_scraped_at TIMESTAMP;

ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS 
  reddit_mention_count INTEGER DEFAULT 0;

ALTER TABLE perfumes ADD COLUMN IF NOT EXISTS 
  community_rating FLOAT;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Top rated perfumes with community data
CREATE OR REPLACE VIEW v_top_perfumes AS
SELECT 
  p.*,
  a.overall_sentiment,
  a.compliment_factor,
  COUNT(DISTINCT r.id) as mention_count
FROM perfumes p
LEFT JOIN ai_analysis a ON p.id = a.perfume_id
LEFT JOIN reddit_mentions r ON p.id = r.perfume_id
GROUP BY p.id, a.overall_sentiment, a.compliment_factor
ORDER BY a.overall_sentiment DESC NULLS LAST;

-- Recently discussed perfumes
CREATE OR REPLACE VIEW v_trending_perfumes AS
SELECT 
  p.id,
  p.name,
  p.brand_id,
  COUNT(r.id) as recent_mentions,
  AVG(r.upvotes) as avg_engagement
FROM perfumes p
JOIN reddit_mentions r ON p.id = r.perfume_id
WHERE r.scraped_at > NOW() - INTERVAL '30 days'
GROUP BY p.id, p.name, p.brand_id
ORDER BY recent_mentions DESC
LIMIT 50;

-- Row Level Security for new tables
alter table reddit_mentions enable row level security;
alter table ai_analysis enable row level security;
alter table scraping_jobs enable row level security;

-- Public read policies
create policy "Public reddit mentions viewable" on reddit_mentions for select using (true);
create policy "Public AI analysis viewable" on ai_analysis for select using (true);
create policy "Public scraping jobs viewable" on scraping_jobs for select using (true);

-- Insert policy for scraping jobs (allow anon for demo purposes, or secure later)
create policy "Anon can insert scraping jobs" on scraping_jobs for insert with check (true);
create policy "Anon can update scraping jobs" on scraping_jobs for update using (true);
create policy "Anon can insert reddit mentions" on reddit_mentions for insert with check (true);
create policy "Anon can insert ai analysis" on ai_analysis for insert with check (true);
create policy "Anon can update perfumes" on perfumes for update using (true);
