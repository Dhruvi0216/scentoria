-- ============================================
-- SCENTORIA COMPLETE SCHEMA SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Base Tables
create table if not exists brands (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  country text,
  type text check (type in ('Designer', 'Middle Eastern', 'Niche')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name)
);

create table if not exists perfumes (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references brands(id) not null,
  name text not null,
  slug text not null unique,
  year integer,
  concentration text check (concentration in ('EDT', 'EDP', 'Parfum', 'Extrait', 'Cologne')),
  image_url text,
  status text check (status in ('draft', 'published')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_scraped_at timestamp,
  reddit_mention_count integer default 0,
  community_rating float
);

create table if not exists accords (
  id uuid default uuid_generate_v4() primary key,
  perfume_id uuid references perfumes(id) on delete cascade not null,
  accord_name text not null,
  weight integer check (weight >= 1 and weight <= 10) not null
);

create table if not exists notes (
  id uuid default uuid_generate_v4() primary key,
  perfume_id uuid references perfumes(id) on delete cascade not null,
  note_name text not null,
  note_type text check (note_type in ('Top', 'Middle', 'Base', 'Dominant', 'Supporting')) not null
);

create table if not exists performance (
  id uuid default uuid_generate_v4() primary key,
  perfume_id uuid references perfumes(id) on delete cascade not null unique,
  longevity text,
  projection text,
  heat_tolerance text check (heat_tolerance in ('Low', 'Medium', 'High'))
);

create table if not exists verdicts (
  id uuid default uuid_generate_v4() primary key,
  perfume_id uuid references perfumes(id) on delete cascade not null unique,
  buy_or_skip text check (buy_or_skip in ('Buy', 'Skip', 'Situational')),
  who_it_is_for text,
  who_should_avoid text,
  summary text
);

-- 3. Create Community Features Tables
CREATE TABLE if not exists reddit_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  post_title TEXT,
  post_url TEXT,
  subreddit VARCHAR(50),
  comment_text TEXT NOT NULL,
  comment_author VARCHAR(50),
  comment_permalink TEXT,
  upvotes INTEGER DEFAULT 0,
  scraped_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP,
  search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', comment_text)) STORED
);

CREATE TABLE if not exists ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  overall_sentiment FLOAT CHECK (overall_sentiment BETWEEN 0 AND 10),
  confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
  occasions JSONB,
  best_seasons JSONB,
  compliment_factor TEXT CHECK (compliment_factor IN ('High', 'Medium', 'Low')),
  avg_longevity_hours FLOAT,
  avg_projection INTEGER CHECK (avg_projection BETWEEN 1 AND 10),
  avg_sillage INTEGER CHECK (avg_sillage BETWEEN 1 AND 10),
  value_rating TEXT CHECK (value_rating IN ('Bargain', 'Fair', 'Overpriced')),
  similar_fragrances JSONB,
  pros JSONB,
  cons JSONB,
  total_mentions INTEGER DEFAULT 0,
  analyzed_at TIMESTAMP DEFAULT NOW(),
  analysis_version VARCHAR(10) DEFAULT '1.0'
);

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

-- 4. Create Indexes
CREATE INDEX if not exists idx_reddit_perfume ON reddit_mentions(perfume_id);
CREATE INDEX if not exists idx_reddit_search ON reddit_mentions USING GIN(search_vector);
CREATE INDEX if not exists idx_ai_perfume ON ai_analysis(perfume_id);
CREATE INDEX if not exists idx_jobs_status ON scraping_jobs(status);

-- 5. Enable RLS
alter table brands enable row level security;
alter table perfumes enable row level security;
alter table accords enable row level security;
alter table notes enable row level security;
alter table performance enable row level security;
alter table verdicts enable row level security;
alter table reddit_mentions enable row level security;
alter table ai_analysis enable row level security;
alter table scraping_jobs enable row level security;

-- 6. Create RLS Policies
-- Read policies (Public Access)
create policy "Public brands viewable" on brands for select using (true);
create policy "Public perfumes viewable" on perfumes for select using (status = 'published');
create policy "Public accords viewable" on accords for select using (true);
create policy "Public notes viewable" on notes for select using (true);
create policy "Public performance viewable" on performance for select using (true);
create policy "Public verdicts viewable" on verdicts for select using (true);
create policy "Public reddit mentions viewable" on reddit_mentions for select using (true);
create policy "Public ai analysis viewable" on ai_analysis for select using (true);
create policy "Public scraping jobs viewable" on scraping_jobs for select using (true);

-- Write policies (Anon/Service Role for demo)
create policy "Anon can insert brands" on brands for insert with check (true);
create policy "Anon can insert perfumes" on perfumes for insert with check (true);
create policy "Anon can update perfumes" on perfumes for update using (true);
create policy "Anon can insert accords" on accords for insert with check (true);
create policy "Anon can insert notes" on notes for insert with check (true);
create policy "Anon can insert performance" on performance for insert with check (true);
create policy "Anon can insert verdicts" on verdicts for insert with check (true);

create policy "Anon can insert scraping jobs" on scraping_jobs for insert with check (true);
create policy "Anon can update scraping jobs" on scraping_jobs for update using (true);
create policy "Anon can insert reddit mentions" on reddit_mentions for insert with check (true);
create policy "Anon can insert ai analysis" on ai_analysis for insert with check (true);
