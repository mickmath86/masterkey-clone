# MarketPulse — Supabase Integration & Weekly Data Pipeline

## Overview

This document covers three things:
1. **Database schema** — what to upload into Supabase
2. **Data collection strategy** — Perplexity API vs Computer task
3. **Implementation roadmap** — step-by-step from here to a live, auto-updating dashboard

---

## 1. Database Schema

The file `schema.sql` (in this same folder) contains the complete SQL to run in Supabase's SQL Editor. It creates **13 tables**, **4 convenience views**, and **RLS policies**.

### Table Map → Dashboard Components

| Table | Dashboard Component | Update Frequency |
|---|---|---|
| `leads` | Email gate form on /marketpulse | On every form submission |
| `markets` | Market tabs (5 cities) | Static — seed once |
| `market_snapshots` | Key Metrics cards, Sentiment bar, Market Summary text | Weekly |
| `comps` | Recent Comps table | Weekly |
| `price_history` | Median Price line chart (SFR/Condo/Townhome × timeframe) | Monthly (append) |
| `trending_neighborhoods` | Right sidebar — Trending Neighborhoods | Weekly |
| `recent_activity` | Right sidebar — Recent Activity feed | Weekly (or real-time) |
| `county_indicators` | Right sidebar — Ventura County Indicators (6 metrics) | Weekly |
| `property_type_breakdown` | Right sidebar — By Property Type (5 categories) | Weekly |
| `news_articles` | Dashboard news section + /news page | Daily via RSS |
| `neighborhoods` | /neighborhood-guide page (6 profiles) | Monthly |
| `playbooks` | /playbooks page (CMS-like content) | Manual/as-needed |
| `data_pipeline_log` | Not displayed — audit trail for pipeline runs | Every run |

### How to Deploy the Schema

1. Go to your Supabase project → **SQL Editor**
2. Paste the entire contents of `schema.sql`
3. Click **Run** — it will create all tables, indexes, views, and RLS policies
4. Copy your project URL and `anon` key for the frontend, and `service_role` key for the data pipeline

---

## 2. Data Collection: Perplexity API vs Computer Task

### Recommendation: Use Both — Each for What It's Best At

| Data Category | Best Approach | Why |
|---|---|---|
| **Market metrics** (median price, DOM, inventory, price/sqft, sentiment, market summary) | **Perplexity Sonar API** | Structured JSON output from web-grounded search. Can query MLS-adjacent public data (Redfin, Zillow, Realtor.com). ~$0.01–0.05 per market query. |
| **Recent comps** | **Perplexity Sonar API** | Ask for \"8 most recent home sales in Thousand Oaks CA\" → returns structured data with addresses and prices. |
| **Price history** (monthly medians) | **Perplexity Sonar API** | Historical median prices are widely available on Redfin/Zillow. One query per market per month. |
| **Trending neighborhoods** | **Perplexity Sonar API** | \"Top appreciating neighborhoods in Ventura County\" → structured list. |
| **County indicators** | **Perplexity Sonar API** | County-level stats are well-documented in public data. |
| **News articles** | **RSS Feed parser** (code) | Don't need AI for this. Parse RSS from VC Star, Mortgage News Daily, CAR, etc. with a simple Node.js or Python script. |
| **Neighborhood profiles** | **Computer Task** (monthly) | More nuanced — school ratings, walk scores, descriptions need deeper research. Computer can do this thoroughly once a month. |

### Why Perplexity Sonar API is the Right Primary Tool

1. **Web-grounded** — searches Redfin, Zillow, Realtor.com, county records in real time
2. **Structured JSON output** — use `response_format: { type: \"json_schema\" }` to get data in your exact schema shape
3. **Cheap at your scale** — 5 markets × ~5 queries each = ~25 API calls/week. At ~$0.02/call average (Sonar), that's ~$0.50/week or ~$2/month
4. **Citable** — responses include source URLs you could optionally display

### Perplexity API Workflow (Weekly)

```
For each market (5 cities):
  1. Query: \"Current real estate market stats for {city}, CA\"
     → Extract: median price, active listings, avg DOM, price/sqft, changes
     → Write to: market_snapshots

  2. Query: \"8 most recent home sales in {city}, CA with address, price, sqft, price per sqft, days on market\"
     → Write to: comps

  3. Query: \"Monthly median home prices in {city} CA for SFR, condos, townhomes over the past 12 months\"
     → Write to: price_history (upsert)

  4. Query: \"Market sentiment analysis for {city} CA real estate - is it a buyer's or seller's market?\"
     → Extract sentiment score (0-100)
     → Write to: market_snapshots.sentiment_score

Then (county-level, once):
  5. Query: \"Ventura County CA real estate indicators - median price, inventory, DOM, list-to-sale ratio, months of supply, new listings\"
     → Write to: county_indicators

  6. Query: \"Top appreciating neighborhoods in Ventura County CA\"
     → Write to: trending_neighborhoods

  7. Query: \"Ventura County median home prices by property type - single family, condo/townhome, multi-family, luxury, new construction\"
     → Write to: property_type_breakdown
```

Total: ~27 API calls per week. Estimated cost: **$0.50–$1.50/week**.

### RSS Feed Parsing (Daily)

A simple script (no AI needed) to pull news:
- VC Star RSS
- Mortgage News Daily RSS
- CAR (California Association of Realtors) RSS
- CoStar/Pacific Coast Business Times RSS

Parse title, source, date, category, image, URL → insert into `news_articles`.

### When to Use a Computer Task Instead

A recurring Computer task makes sense for:
- **Neighborhood Guide updates** (monthly) — deeper research with walk scores, school ratings, descriptions
- **Backup/validation** — spot-checking the API data against actual Redfin/Zillow pages
- **One-time data backfill** — populating historical price_history going back 5 years

---

## 3. Implementation Roadmap

### Phase 1: Database Setup (Day 1) ✅
- [x] Create Supabase project
- [x] Run `schema.sql` in SQL Editor
- [x] Note down: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Phase 2: Frontend Integration (Days 2–3) ✅
- [x] Install `@supabase/supabase-js` in the Next.js project
- [x] Create a Supabase client utility (`src/lib/supabase.ts`)
- [x] Replace hardcoded mock data in `MarketPulseDashboard.tsx` with Supabase queries
- [x] Replace mock data in sub-pages (news, neighborhoods, playbooks)
- [x] Wire up the email gate form to INSERT into the `leads` table

### Phase 3: Data Pipeline Script (Days 4–5) ✅
- [x] Create pipeline script (`supabase/pipeline/collect-data.ts`)
- [x] Use Perplexity Sonar API with structured JSON output
- [x] Use the Supabase `service_role` key for writes (bypasses RLS)
- [x] Test with all 5 markets
- [x] Log every run to `data_pipeline_log`

### Phase 4: Weekly Automation (Day 6)
- [ ] Set up a weekly recurring task to run the pipeline script
- [ ] Add a daily RSS fetch for news

### Phase 5: Historical Data Backfill
- [ ] Backfill `price_history` with 5 years of monthly data
- [ ] Seed initial neighborhood profiles

---

## 4. Technical Notes

### Static Export Compatibility
The current `next.config.ts` uses `output: \"export\"`. This means:
- No server-side rendering or API routes
- All Supabase queries happen client-side in the browser
- This is fine — the RLS policies allow public read access via the anon key
- The anon key is safe to expose in client-side code (RLS protects the data)
- Lead form submissions use client-side INSERT (allowed by the RLS INSERT policy on `leads`)

### Environment Variables Needed
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

For the pipeline script (never in frontend):
```env
SUPABASE_SERVICE_ROLE_KEY=eyJ...
PERPLEXITY_API_KEY=pplx-...
```

### Perplexity API Setup
1. Go to https://docs.perplexity.ai → sign up for API access
2. Get an API key
3. Use the `sonar` model for most queries (~$0.01/query)
4. Use `response_format: { type: \"json_schema\" }` for structured output
5. Estimated monthly cost: **$2–6/month** for 5 markets weekly

---

## Running the Pipeline

```bash
# Set env vars
export PERPLEXITY_API_KEY=pplx-xxx
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_KEY=eyJ...

# Run the pipeline
npm run pipeline
```
