-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Brands Table
create table brands (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  country text,
  type text check (type in ('Designer', 'Middle Eastern', 'Niche')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Perfumes Table
create table perfumes (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references brands(id) not null,
  name text not null,
  slug text not null unique,
  year integer,
  concentration text check (concentration in ('EDT', 'EDP', 'Parfum', 'Extrait', 'Cologne')),
  image_url text,
  status text check (status in ('draft', 'published')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Accords Table (Many-to-One with Perfumes)
create table accords (
  id uuid default uuid_generate_v4() primary key,
  perfume_id uuid references perfumes(id) on delete cascade not null,
  accord_name text not null,
  weight integer check (weight >= 1 and weight <= 10) not null
);

-- Notes Table (Many-to-One with Perfumes)
create table notes (
  id uuid default uuid_generate_v4() primary key,
  perfume_id uuid references perfumes(id) on delete cascade not null,
  note_name text not null,
  note_type text check (note_type in ('Top', 'Middle', 'Base', 'Dominant', 'Supporting')) not null
);

-- Performance Table (One-to-One with Perfumes)
create table performance (
  id uuid default uuid_generate_v4() primary key,
  perfume_id uuid references perfumes(id) on delete cascade not null unique,
  longevity text, -- e.g. "6-8 hours"
  projection text, -- e.g. "Moderate"
  heat_tolerance text check (heat_tolerance in ('Low', 'Medium', 'High'))
);

-- Verdicts Table (One-to-One with Perfumes)
create table verdicts (
  id uuid default uuid_generate_v4() primary key,
  perfume_id uuid references perfumes(id) on delete cascade not null unique,
  buy_or_skip text check (buy_or_skip in ('Buy', 'Skip', 'Situational')),
  who_it_is_for text,
  who_should_avoid text,
  summary text
);

-- Low Level Security (RLS) - Enable for all tables
alter table brands enable row level security;
alter table perfumes enable row level security;
alter table accords enable row level security;
alter table notes enable row level security;
alter table performance enable row level security;
alter table verdicts enable row level security;

-- Public Read Policies (Allow anyone to read published data)
create policy "Public brands are viewable by everyone" on brands for select using (true);
create policy "Public perfumes are viewable by everyone" on perfumes for select using (status = 'published');
create policy "Accords viewable" on accords for select using (exists (select 1 from perfumes where id = accords.perfume_id and status = 'published'));
create policy "Notes viewable" on notes for select using (exists (select 1 from perfumes where id = notes.perfume_id and status = 'published'));
create policy "Performance viewable" on performance for select using (exists (select 1 from perfumes where id = performance.perfume_id and status = 'published'));
create policy "Verdicts viewable" on verdicts for select using (exists (select 1 from perfumes where id = verdicts.perfume_id and status = 'published'));
