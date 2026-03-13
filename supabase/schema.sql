-- ═══════════════════════════════════════════════════════════════════
-- MasterKey MarketPulse — Supabase Schema
-- Generated from full audit of MarketPulseDashboard.tsx, 
-- neighborhood-guide, playbooks, and news pages
-- ═══════════════════════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ───────────────────────────────────────────────────────────────────
-- 1. LEADS — Email gate submissions from /marketpulse landing page
-- ───────────────────────────────────────────────────────────────────
create table leads (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text,               -- optional
  created_at    timestamptz not null default now(),
  source        text default 'marketpulse'
);

create unique index leads_email_idx on leads (email);

-- ───────────────────────────────────────────────────────────────────
-- 2. MARKETS — The 5 tracked cities
--    (thousand-oaks, camarillo, westlake, oxnard, ventura)
-- ───────────────────────────────────────────────────────────────────
create table markets (
  id            text primary key,   -- e.g. 'thousand-oaks'
  label         text not null,      -- e.g. 'Thousand Oaks'
  county        text not null default 'Ventura',
  state         text not null default 'CA',
  created_at    timestamptz not null default now()
);

-- Seed the 5 markets
insert into markets (id, label) values
  ('thousand-oaks', 'Thousand Oaks'),
  ('camarillo', 'Camarillo'),
  ('westlake', 'Westlake Village'),
  ('oxnard', 'Oxnard'),
  ('ventura', 'Ventura');

-- ───────────────────────────────────────────────────────────────────
-- 3. MARKET_SNAPSHOTS — Weekly point-in-time metrics per market
--    One row per market per week. This is the core data the weekly
--    pipeline writes. Dashboard "Key Metrics" cards read the latest row.
-- ───────────────────────────────────────────────────────────────────
create table market_snapshots (
  id                          uuid primary key default gen_random_uuid(),
  market_id                   text not null references markets(id),
  snapshot_date               date not null,

  -- Key Metrics (4 metric cards)
  median_price                integer not null,         -- in cents or whole dollars
  median_change_pct           numeric(6,2),             -- e.g. 4.2
  median_change_positive      boolean default true,
  active_listings             integer,
  avg_dom                     integer,                  -- avg days on market
  avg_dom_change              text,                     -- e.g. '-3 days'
  avg_dom_change_positive     boolean,
  price_per_sqft              integer,                  -- whole dollars
  price_per_sqft_change_pct   numeric(6,2),
  price_per_sqft_change_positive boolean,
  sparkline                   integer[],                -- 12-point sparkline array

  -- Sentiment
  sentiment_score             integer check (sentiment_score between 0 and 100),
  sale_to_list_ratio          numeric(5,2),
  market_competitiveness      text,

  -- AI-generated market summary text
  market_summary_text         text,

  created_at                  timestamptz not null default now(),
  
  unique(market_id, snapshot_date)
);

create index market_snapshots_market_date on market_snapshots (market_id, snapshot_date desc);

-- ───────────────────────────────────────────────────────────────────
-- 4. COMPS — Recent comparable sales per market
--    Dashboard "Recent Comps" table reads latest comps.
-- ───────────────────────────────────────────────────────────────────
create table comps (
  id              uuid primary key default gen_random_uuid(),
  market_id       text not null references markets(id),
  address         text not null,
  sold_price      integer not null,          -- whole dollars
  sqft            integer not null,
  price_per_sqft  integer not null,          -- whole dollars
  dom             integer not null,          -- days on market
  sold_date       date,
  property_type   text,                      -- 'sfr', 'condo', 'townhome', 'multi-family'
  created_at      timestamptz not null default now()
);

create index comps_market_date on comps (market_id, created_at desc);

-- ───────────────────────────────────────────────────────────────────
-- 5. PRICE_HISTORY — Monthly median prices by property type per market
--    Feeds the Recharts line chart (SFR / Condo / Townhome toggles)
--    and the timeframe selector (1M, 3M, 6M, 1Y, 5Y, All)
-- ───────────────────────────────────────────────────────────────────
create table price_history (
  id              uuid primary key default gen_random_uuid(),
  market_id       text not null references markets(id),
  month           date not null,             -- first day of month
  month_label     text not null,             -- e.g. "Apr '25", "Jan '26"
  sfr             integer not null,          -- median SFR price
  condo           integer not null,          -- median condo price
  townhome        integer not null,          -- median townhome price
  created_at      timestamptz not null default now(),

  unique(market_id, month)
);

create index price_history_market_month on price_history (market_id, month desc);

-- ───────────────────────────────────────────────────────────────────
-- 6. TRENDING_NEIGHBORHOODS — Right sidebar "Trending" section
--    Updated weekly. Global (not per-market).
-- ───────────────────────────────────────────────────────────────────
create table trending_neighborhoods (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,             -- e.g. 'North Ranch'
  area            text not null,             -- e.g. 'Westlake Village'
  change_pct      text not null,             -- e.g. '+8.2%'
  positive        boolean default true,
  sort_order      integer default 0,
  snapshot_date   date not null,             -- when this ranking was computed
  created_at      timestamptz not null default now()
);

create index trending_neighborhoods_date on trending_neighborhoods (snapshot_date desc);

-- ───────────────────────────────────────────────────────────────────
-- 7. RECENT_ACTIVITY — Right sidebar "Recent Activity" feed
--    New listings, price reductions, sold notifications.
-- ───────────────────────────────────────────────────────────────────
create table recent_activity (
  id              uuid primary key default gen_random_uuid(),
  activity_type   text not null,             -- 'New listing', 'Price reduced', 'Sold'
  address         text not null,
  price           text not null,             -- e.g. '$1,350,000' or '$785,000 → $765,000'
  market_id       text references markets(id),
  activity_date   timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index recent_activity_date on recent_activity (activity_date desc);

-- ───────────────────────────────────────────────────────────────────
-- 8. COUNTY_INDICATORS — Right sidebar "Ventura County Indicators"
--    6 county-level metrics, updated weekly.
-- ───────────────────────────────────────────────────────────────────
create table county_indicators (
  id              uuid primary key default gen_random_uuid(),
  label           text not null,             -- e.g. 'Ventura County Median'
  value           text not null,             -- e.g. '$965,000'
  change          text not null,             -- e.g. '+3.8%'
  positive        boolean default true,
  sort_order      integer default 0,
  snapshot_date   date not null,
  created_at      timestamptz not null default now()
);

create index county_indicators_date on county_indicators (snapshot_date desc);

-- ───────────────────────────────────────────────────────────────────
-- 9. PROPERTY_TYPE_BREAKDOWN — Right sidebar "By Property Type"
--    County-level price breakdown by property type.
-- ───────────────────────────────────────────────────────────────────
create table property_type_breakdown (
  id              uuid primary key default gen_random_uuid(),
  label           text not null,             -- e.g. 'Single Family', 'Luxury ($2M+)'
  value           text not null,             -- e.g. '$1,050,000'
  change_pct      text not null,             -- e.g. '+4.1%'
  positive        boolean default true,
  sort_order      integer default 0,
  snapshot_date   date not null,
  created_at      timestamptz not null default now()
);

create index property_type_breakdown_date on property_type_breakdown (snapshot_date desc);

-- ───────────────────────────────────────────────────────────────────
-- 10. NEWS_ARTICLES — Dashboard + News page RSS content
--     Populated from RSS feeds weekly or more frequently.
-- ───────────────────────────────────────────────────────────────────
create table news_articles (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  source          text not null,             -- e.g. 'VC Star', 'CoStar'
  published_date  text not null,             -- display string e.g. 'Mar 11, 2026'
  published_at    timestamptz,               -- actual timestamp for sorting
  category        text not null,             -- e.g. 'Market Data', 'Rates', 'Development'
  image_url       text,
  article_url     text not null,
  created_at      timestamptz not null default now()
);

create unique index news_articles_url_idx on news_articles (article_url);
create index news_articles_published on news_articles (published_at desc);

-- ───────────────────────────────────────────────────────────────────
-- 11. NEIGHBORHOODS — Neighborhood Guide page
--     Detailed profiles for featured neighborhoods.
-- ───────────────────────────────────────────────────────────────────
create table neighborhoods (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,             -- e.g. 'North Ranch'
  city            text not null,             -- e.g. 'Westlake Village'
  market_id       text references markets(id),
  median_price    text not null,             -- display string e.g. '$2,450,000'
  change_pct      text not null,             -- e.g. '+8.2%'
  schools_rating  text,                      -- e.g. '9/10'
  walk_score      integer,
  description     text,
  sort_order      integer default 0,
  updated_at      timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

-- ───────────────────────────────────────────────────────────────────
-- 12. PLAYBOOKS — Playbooks page (mostly static, CMS-like)
-- ───────────────────────────────────────────────────────────────────
create table playbooks (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text not null,
  tag             text not null,             -- e.g. 'Buyer', 'Seller', 'Investor', 'Luxury'
  tag_color       text,                      -- Tailwind classes for badge styling
  sort_order      integer default 0,
  content         text,                      -- full playbook content (markdown or HTML)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ───────────────────────────────────────────────────────────────────
-- 13. DATA_PIPELINE_LOG — Track weekly data collection runs
--     Audit trail for when data was refreshed and by what method.
-- ───────────────────────────────────────────────────────────────────
create table data_pipeline_log (
  id              uuid primary key default gen_random_uuid(),
  run_date        timestamptz not null default now(),
  source          text not null,             -- 'perplexity_api', 'computer_task', 'rss_feed'
  status          text not null default 'running', -- 'running', 'completed', 'failed'
  markets_updated text[],                    -- which markets got new data
  tables_updated  text[],                    -- which tables were written to
  error_message   text,
  duration_ms     integer,
  created_at      timestamptz not null default now()
);

-- ───────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables. The Next.js frontend will use the 
-- Supabase anon key with read-only policies. Write access is 
-- restricted to the service_role key used by the data pipeline.
-- ───────────────────────────────────────────────────────────────────

-- Enable RLS
alter table leads enable row level security;
alter table markets enable row level security;
alter table market_snapshots enable row level security;
alter table comps enable row level security;
alter table price_history enable row level security;
alter table trending_neighborhoods enable row level security;
alter table recent_activity enable row level security;
alter table county_indicators enable row level security;
alter table property_type_breakdown enable row level security;
alter table news_articles enable row level security;
alter table neighborhoods enable row level security;
alter table playbooks enable row level security;
alter table data_pipeline_log enable row level security;

-- Public read access for dashboard data (anon key)
create policy "Public read markets"          on markets              for select using (true);
create policy "Public read snapshots"        on market_snapshots     for select using (true);
create policy "Public read comps"            on comps                for select using (true);
create policy "Public read price_history"    on price_history        for select using (true);
create policy "Public read trending"         on trending_neighborhoods for select using (true);
create policy "Public read activity"         on recent_activity      for select using (true);
create policy "Public read indicators"       on county_indicators    for select using (true);
create policy "Public read prop types"       on property_type_breakdown for select using (true);
create policy "Public read news"             on news_articles        for select using (true);
create policy "Public read neighborhoods"    on neighborhoods        for select using (true);
create policy "Public read playbooks"        on playbooks            for select using (true);

-- Leads: anon can INSERT (form submission), but cannot read other leads
create policy "Anon insert leads"            on leads                for insert with check (true);

-- Pipeline log: no public access
-- (Only service_role key can read/write — no explicit policy needed,
--  service_role bypasses RLS by default)

-- ───────────────────────────────────────────────────────────────────
-- VIEWS — Convenience views for the frontend queries
-- ───────────────────────────────────────────────────────────────────

-- Latest snapshot per market (what the dashboard loads)
create or replace view latest_market_snapshots as
select distinct on (market_id) *
from market_snapshots
order by market_id, snapshot_date desc;

-- Latest county indicators
create or replace view latest_county_indicators as
select * from county_indicators
where snapshot_date = (select max(snapshot_date) from county_indicators)
order by sort_order;

-- Latest trending neighborhoods  
create or replace view latest_trending_neighborhoods as
select * from trending_neighborhoods
where snapshot_date = (select max(snapshot_date) from trending_neighborhoods)
order by sort_order;

-- Latest property type breakdown
create or replace view latest_property_type_breakdown as
select * from property_type_breakdown
where snapshot_date = (select max(snapshot_date) from property_type_breakdown)
order by sort_order;
