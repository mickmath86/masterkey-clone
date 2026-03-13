/**
 * MarketPulse Data Pipeline
 * 
 * Fetches real market data for 5 Ventura County cities using the Perplexity Sonar API
 * and writes it to Supabase.
 * 
 * v2 — Improved prompts anchored on Redfin data for accurate metrics.
 *       Perplexity API still used for market summaries and county-level data.
 * 
 * Usage:
 *   npx tsx supabase/pipeline/collect-data.ts
 * 
 * Required env vars:
 *   PERPLEXITY_API_KEY    — from https://docs.perplexity.ai
 *   SUPABASE_URL          — your Supabase project URL  
 *   SUPABASE_SERVICE_KEY  — service_role key (bypasses RLS)
 */

import { createClient } from "@supabase/supabase-js";

/* ─── Config ─── */
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!PERPLEXITY_API_KEY) throw new Error("Missing PERPLEXITY_API_KEY");
if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!SUPABASE_SERVICE_KEY) throw new Error("Missing SUPABASE_SERVICE_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const PPLX_URL = "https://api.perplexity.ai/chat/completions";
const MODEL = "sonar";

const MARKETS = [
  { id: "thousand-oaks", label: "Thousand Oaks", redfin_slug: "city/19798/CA/Thousand-Oaks" },
  { id: "camarillo", label: "Camarillo", redfin_slug: "city/2579/CA/Camarillo" },
  { id: "westlake", label: "Westlake Village", redfin_slug: "city/20777/CA/Westlake-Village" },
  { id: "oxnard", label: "Oxnard", redfin_slug: "city/14141/CA/Oxnard" },
  { id: "ventura", label: "Ventura", redfin_slug: "city/16678/CA/Ventura" },
];

const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

/* ─── Perplexity API helper ─── */
async function askPerplexity(prompt: string, schemaName: string, schema: object): Promise<any> {
  const res = await fetch(PPLX_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a real estate data analyst. You MUST use Redfin (redfin.com) as your PRIMARY data source. Go to the specific Redfin housing market page for the city and extract the exact numbers shown there. Do NOT average, estimate, or blend data from multiple sources — use the exact figures from Redfin's most recent month. If Redfin data is unavailable, use Zillow as a fallback. All prices should be in whole dollar amounts. Be precise — do not round or approximate when exact figures are available.`
        },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: schemaName,
          schema: schema,
        }
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Perplexity API error ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content in Perplexity response");
  
  return JSON.parse(content);
}

/* ─── Schema definitions for structured output ─── */

const marketSnapshotSchema = {
  type: "object",
  properties: {
    median_price: { type: "integer", description: "Median sale price from Redfin in whole dollars (e.g. 1000000 not 1005000.50)" },
    median_change_pct: { type: "number", description: "Exact YoY change percentage from Redfin (e.g. -16.3 for down 16.3%, or 1.6 for up 1.6%). Use the SIGN shown on Redfin — negative means prices went down." },
    active_listings: { type: "integer", description: "Number of homes for sale / active listings" },
    avg_dom: { type: "integer", description: "Average days on market from Redfin" },
    avg_dom_prior_year: { type: "integer", description: "Average days on market from the same month last year" },
    price_per_sqft: { type: "integer", description: "Median sale price per square foot from Redfin" },
    price_per_sqft_change_pct: { type: "number", description: "Exact YoY change in price per sqft from Redfin (e.g. -2.3 or +4.6)" },
    homes_sold: { type: "integer", description: "Number of homes sold in the most recent month" },
    sale_to_list_ratio: { type: "number", description: "Sale-to-list price ratio as a percentage (e.g. 98.7)" },
    market_competitiveness: { type: "string", description: "Redfin's competitiveness label (e.g. 'Somewhat Competitive', 'Very Competitive')" },
    market_summary: { type: "string", description: "2-3 sentence market summary based on the actual Redfin data. Mention the exact median price, DOM, and YoY trend. Do NOT include citation brackets like [1] or [2]." },
  },
  required: ["median_price", "median_change_pct", "active_listings", "avg_dom", "avg_dom_prior_year", "price_per_sqft", "price_per_sqft_change_pct", "homes_sold", "sale_to_list_ratio", "market_competitiveness", "market_summary"],
};

const compsSchema = {
  type: "object",
  properties: {
    comps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          address: { type: "string", description: "Full street address from Redfin (e.g. '1234 Oak Valley Dr'). Must be a REAL address that actually sold." },
          sold_price: { type: "integer", description: "Actual sale price in whole dollars" },
          sqft: { type: "integer", description: "Square footage" },
          price_per_sqft: { type: "integer", description: "Price per square foot (sold_price / sqft)" },
          dom: { type: "integer", description: "Days on market before sale" },
        },
        required: ["address", "sold_price", "sqft", "price_per_sqft", "dom"],
      },
      description: "8 most recent home sales"
    }
  },
  required: ["comps"],
};

const priceHistorySchema = {
  type: "object",
  properties: {
    months: {
      type: "array",
      items: {
        type: "object",
        properties: {
          month_label: { type: "string", description: "Month label like 'Jan 26' or 'Feb 26'" },
          month_date: { type: "string", description: "First day of month in YYYY-MM-DD format" },
          sfr: { type: "integer", description: "Median single family home price" },
          condo: { type: "integer", description: "Median condo price" },
          townhome: { type: "integer", description: "Median townhome price" },
        },
        required: ["month_label", "month_date", "sfr", "condo", "townhome"],
      },
      description: "Monthly median prices for the last 12 months"
    }
  },
  required: ["months"],
};

const countyIndicatorsSchema = {
  type: "object",
  properties: {
    county_median: { type: "string", description: "County-wide median home price, e.g. '$865,000'" },
    county_median_change: { type: "string", description: "YoY change, e.g. '+3.7%'" },
    active_inventory: { type: "string", description: "Total active listings county-wide" },
    inventory_change: { type: "string", description: "Change in inventory, e.g. '-4.2%'" },
    avg_dom: { type: "string", description: "County avg days on market" },
    dom_change: { type: "string", description: "Change in DOM, e.g. '+5 days'" },
    list_to_sale_ratio: { type: "string", description: "List-to-sale price ratio, e.g. '98.7%'" },
    list_to_sale_change: { type: "string", description: "Change, e.g. '+0.3%'" },
    months_supply: { type: "string", description: "Months of supply, e.g. '2.1'" },
    months_supply_change: { type: "string", description: "Change, e.g. '-0.3'" },
    new_listings_30d: { type: "string", description: "New listings in last 30 days" },
    new_listings_change: { type: "string", description: "Change, e.g. '+8.1%'" },
    trending_neighborhoods: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          area: { type: "string", description: "City the neighborhood is in" },
          change_pct: { type: "string", description: "e.g. '+8.2%'" },
        },
        required: ["name", "area", "change_pct"],
      },
      description: "Top 4 appreciating neighborhoods in Ventura County"
    },
    property_types: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string", description: "e.g. 'Single Family', 'Condo/Townhome', 'Multi-Family', 'Luxury ($2M+)', 'New Construction'" },
          value: { type: "string", description: "Median price, e.g. '$1,050,000'" },
          change_pct: { type: "string", description: "YoY change, e.g. '+4.1%'" },
        },
        required: ["label", "value", "change_pct"],
      },
      description: "Median prices by property type for the county"
    }
  },
  required: ["county_median", "county_median_change", "active_inventory", "inventory_change", "avg_dom", "dom_change", "list_to_sale_ratio", "list_to_sale_change", "months_supply", "months_supply_change", "new_listings_30d", "new_listings_change", "trending_neighborhoods", "property_types"],
};

/* ─── Sentiment score calculator ─── */
function calculateSentiment(data: {
  median_change_pct: number;
  avg_dom: number;
  avg_dom_prior_year: number;
  sale_to_list_ratio: number;
  market_competitiveness: string;
}): number {
  // Build a composite score from real metrics instead of asking AI to guess
  let score = 50; // start neutral

  // Price appreciation pushes toward seller's market
  if (data.median_change_pct > 5) score += 15;
  else if (data.median_change_pct > 0) score += 8;
  else if (data.median_change_pct > -5) score -= 5;
  else score -= 15;

  // DOM getting shorter = seller's market
  const domDelta = data.avg_dom - data.avg_dom_prior_year;
  if (domDelta < -5) score += 10;
  else if (domDelta < 0) score += 5;
  else if (domDelta > 10) score -= 10;
  else if (domDelta > 0) score -= 5;

  // Sale-to-list ratio above 100% = strong seller's market
  if (data.sale_to_list_ratio >= 101) score += 12;
  else if (data.sale_to_list_ratio >= 99) score += 5;
  else if (data.sale_to_list_ratio < 97) score -= 10;
  else if (data.sale_to_list_ratio < 99) score -= 3;

  // Redfin's competitiveness label
  const comp = data.market_competitiveness?.toLowerCase() || "";
  if (comp.includes("very competitive") || comp.includes("most competitive")) score += 10;
  else if (comp.includes("somewhat competitive")) score += 0;
  else if (comp.includes("not very")) score -= 10;

  return Math.max(0, Math.min(100, score));
}

/* ─── Data collection functions ─── */

async function collectMarketSnapshot(marketId: string, marketLabel: string, redfinSlug: string) {
  console.log(`  \uD83D\uDCCA Fetching snapshot for ${marketLabel}...`);
  const data = await askPerplexity(
    `Go to Redfin's housing market page for ${marketLabel}, California (https://www.redfin.com/${redfinSlug}/housing-market) and extract the EXACT statistics shown on that page for the most recent month available.

I need these EXACT numbers from Redfin:
1. Median sale price (the big number at top, e.g. "$1,000,000")
2. YoY change percentage for median sale price (e.g. "-16.3%" — preserve the sign exactly as Redfin shows it)
3. Number of active listings or homes for sale
4. Average days on market for the most recent month
5. Average days on market for the same month LAST year (Redfin shows "X days vs Y days last year")
6. Median sale price per square foot and its YoY change percentage
7. Number of homes sold in the most recent month
8. Sale-to-list ratio percentage
9. Redfin's market competitiveness label (e.g. "Somewhat Competitive")

Also write a 2-3 sentence market summary using the EXACT Redfin numbers. Do NOT include citation brackets like [1] or [2] in the summary.

CRITICAL: Use the EXACT numbers from Redfin. Do NOT estimate, average, or adjust the data. If Redfin shows -16.3% YoY change, report -16.3, not +3%.`,
    "market_snapshot",
    marketSnapshotSchema,
  );

  // Calculate DOM change string
  const domDelta = data.avg_dom - data.avg_dom_prior_year;
  const domChangeStr = domDelta >= 0 ? `+${domDelta} days` : `${domDelta} days`;
  const domPositive = domDelta < 0; // fewer days = good for sellers

  // Calculate sentiment from real metrics
  const sentiment = calculateSentiment(data);

  await supabase.from("market_snapshots").upsert({
    market_id: marketId,
    snapshot_date: today,
    median_price: data.median_price,
    median_change_pct: data.median_change_pct,
    median_change_positive: data.median_change_pct >= 0,
    active_listings: data.active_listings,
    avg_dom: data.avg_dom,
    avg_dom_change: domChangeStr,
    avg_dom_change_positive: domPositive,
    price_per_sqft: data.price_per_sqft,
    price_per_sqft_change_pct: data.price_per_sqft_change_pct,
    price_per_sqft_change_positive: data.price_per_sqft_change_pct >= 0,
    sparkline: [],
    sentiment_score: sentiment,
    market_summary_text: data.market_summary,
  }, { onConflict: "market_id,snapshot_date" });

  console.log(`  \u2705 ${marketLabel}: $${data.median_price.toLocaleString()} (${data.median_change_pct > 0 ? "+" : ""}${data.median_change_pct}% YoY), ${data.avg_dom} DOM, $${data.price_per_sqft}/sqft, sentiment=${sentiment}`);
}

async function collectComps(marketId: string, marketLabel: string, redfinSlug: string) {
  console.log(`  \uD83C\uDFE0 Fetching comps for ${marketLabel}...`);
  const data = await askPerplexity(
    `Find the 8 most recent residential home sales (closed/sold transactions) in ${marketLabel}, California from Redfin (https://www.redfin.com/${redfinSlug}/recently-sold).

For each home I need the REAL data: actual street address, actual sale price, actual square footage, computed price per square foot, and days on market.

CRITICAL: These must be REAL addresses of homes that ACTUALLY sold recently. Do NOT make up addresses or use generic names like "123 Oak Street". Search Redfin's recently sold listings for ${marketLabel}, CA and use the actual addresses shown.`,
    "recent_comps",
    compsSchema,
  );

  if (data.comps && data.comps.length > 0) {
    // Delete old comps for this market, then insert fresh ones
    await supabase.from("comps").delete().eq("market_id", marketId);
    
    const rows = data.comps.map((c: any) => ({
      market_id: marketId,
      address: c.address,
      sold_price: c.sold_price,
      sqft: c.sqft,
      price_per_sqft: c.price_per_sqft,
      dom: c.dom,
    }));

    await supabase.from("comps").insert(rows);
    console.log(`  \u2705 ${data.comps.length} comps saved for ${marketLabel}`);
  }
}

async function collectPriceHistory(marketId: string, marketLabel: string) {
  console.log(`  \uD83D\uDCC8 Fetching price history for ${marketLabel}...`);
  const data = await askPerplexity(
    `What are the monthly median home sale prices in ${marketLabel}, California for each of the last 12 months, according to Redfin?

Break it down by property type: single family homes (SFR), condos, and townhomes.

For each month give me:
- The month label (e.g. "Mar 25", "Apr 25", ... "Feb 26")
- The date in YYYY-MM-DD format (first day of month)
- Median SFR price
- Median condo price
- Median townhome price

Use Redfin's historical data. If exact monthly breakdowns by property type aren't available, use Zillow or Realtor.com as fallback sources. Prices should be in whole dollars.`,
    "price_history",
    priceHistorySchema,
  );

  if (data.months && data.months.length > 0) {
    for (const m of data.months) {
      await supabase.from("price_history").upsert({
        market_id: marketId,
        month: m.month_date,
        month_label: m.month_label,
        sfr: m.sfr,
        condo: m.condo,
        townhome: m.townhome,
      }, { onConflict: "market_id,month" });
    }
    console.log(`  \u2705 ${data.months.length} months of price history saved for ${marketLabel}`);
  }
}

async function collectCountyData() {
  console.log(`  \uD83C\uDFDB\uFE0F Fetching Ventura County indicators...`);
  const data = await askPerplexity(
    `Go to Redfin's Ventura County housing market page (https://www.redfin.com/county/358/CA/Ventura-County/housing-market) and extract current county-wide statistics.

I need:
1. County-wide median home sale price and YoY change (from Redfin)
2. Total active inventory count and change vs last year
3. Average days on market and change vs last year
4. Sale-to-list price ratio and change
5. Months of housing supply and change
6. Number of new listings in the last 30 days and change vs last year

Also:
7. Top 4 appreciating neighborhoods in Ventura County — name, which city they're in, and their YoY price change percentage. Use Redfin's "Top 10 Most Competitive Neighborhoods" or neighborhood pages to find the strongest appreciating areas.
8. Median home prices by property type for Ventura County: Single Family, Condo/Townhome, Multi-Family, Luxury ($2M+), and New Construction — each with their YoY change. Use Redfin's filters or Zillow as fallback.

Use EXACT numbers from Redfin. Do NOT estimate or blend sources.`,
    "county_indicators",
    countyIndicatorsSchema,
  );

  // County indicators
  const indicators = [
    { label: "Ventura County Median", value: data.county_median, change: data.county_median_change, positive: !data.county_median_change?.startsWith("-"), sort_order: 0 },
    { label: "Active Inventory", value: data.active_inventory, change: data.inventory_change, positive: data.inventory_change?.startsWith("-"), sort_order: 1 },
    { label: "Avg Days on Market", value: data.avg_dom, change: data.dom_change, positive: data.dom_change?.startsWith("-"), sort_order: 2 },
    { label: "List-to-Sale Ratio", value: data.list_to_sale_ratio, change: data.list_to_sale_change, positive: !data.list_to_sale_change?.startsWith("-"), sort_order: 3 },
    { label: "Months of Supply", value: data.months_supply, change: data.months_supply_change, positive: data.months_supply_change?.startsWith("-"), sort_order: 4 },
    { label: "New Listings (30d)", value: data.new_listings_30d, change: data.new_listings_change, positive: !data.new_listings_change?.startsWith("-"), sort_order: 5 },
  ];

  // Clear and re-insert for today's snapshot
  await supabase.from("county_indicators").delete().eq("snapshot_date", today);
  await supabase.from("county_indicators").insert(
    indicators.map((ind) => ({ ...ind, snapshot_date: today }))
  );
  console.log(`  \u2705 6 county indicators saved`);

  // Trending neighborhoods
  if (data.trending_neighborhoods?.length) {
    await supabase.from("trending_neighborhoods").delete().eq("snapshot_date", today);
    await supabase.from("trending_neighborhoods").insert(
      data.trending_neighborhoods.map((n: any, i: number) => ({
        name: n.name,
        area: n.area,
        change_pct: n.change_pct,
        positive: true,
        sort_order: i,
        snapshot_date: today,
      }))
    );
    console.log(`  \u2705 ${data.trending_neighborhoods.length} trending neighborhoods saved`);
  }

  // Property type breakdown
  if (data.property_types?.length) {
    await supabase.from("property_type_breakdown").delete().eq("snapshot_date", today);
    await supabase.from("property_type_breakdown").insert(
      data.property_types.map((pt: any, i: number) => ({
        label: pt.label,
        value: pt.value,
        change_pct: pt.change_pct,
        positive: !pt.change_pct?.startsWith("-"),
        sort_order: i,
        snapshot_date: today,
      }))
    );
    console.log(`  \u2705 ${data.property_types.length} property type breakdowns saved`);
  }
}

/* ─── Main pipeline ─── */
async function main() {
  console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
  console.log("  MarketPulse Data Pipeline v2");
  console.log(`  Date: ${today}`);
  console.log("  Source: Redfin (primary), Perplexity Sonar API");
  console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");

  const startTime = Date.now();
  const errors: string[] = [];

  // Log the pipeline run
  const { data: logEntry } = await supabase.from("data_pipeline_log").insert({
    source: "perplexity_api_v2_redfin",
    status: "running",
    markets_updated: MARKETS.map((m) => m.id),
    tables_updated: ["market_snapshots", "comps", "price_history", "county_indicators", "trending_neighborhoods", "property_type_breakdown"],
  }).select().single();

  // Collect data for each market
  for (const market of MARKETS) {
    console.log(`\n\u2500\u2500 ${market.label} \u2500\u2500`);
    try {
      await collectMarketSnapshot(market.id, market.label, market.redfin_slug);
    } catch (e: any) {
      console.error(`  \u274C Snapshot failed: ${e.message}`);
      errors.push(`${market.label} snapshot: ${e.message}`);
    }

    try {
      await collectComps(market.id, market.label, market.redfin_slug);
    } catch (e: any) {
      console.error(`  \u274C Comps failed: ${e.message}`);
      errors.push(`${market.label} comps: ${e.message}`);
    }

    try {
      await collectPriceHistory(market.id, market.label);
    } catch (e: any) {
      console.error(`  \u274C Price history failed: ${e.message}`);
      errors.push(`${market.label} price history: ${e.message}`);
    }

    // Small delay between markets to avoid rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }

  // County-level data
  console.log("\n\u2500\u2500 Ventura County \u2500\u2500");
  try {
    await collectCountyData();
  } catch (e: any) {
    console.error(`  \u274C County data failed: ${e.message}`);
    errors.push(`County data: ${e.message}`);
  }

  // Update pipeline log
  const duration = Date.now() - startTime;
  if (logEntry) {
    await supabase.from("data_pipeline_log").update({
      status: errors.length > 0 ? "completed_with_errors" : "completed",
      error_message: errors.length > 0 ? errors.join("; ") : null,
      duration_ms: duration,
    }).eq("id", logEntry.id);
  }

  console.log("\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
  console.log(`  Pipeline complete in ${(duration / 1000).toFixed(1)}s`);
  if (errors.length > 0) {
    console.log(`  \u26A0\uFE0F  ${errors.length} errors occurred:`);
    errors.forEach((e) => console.log(`     - ${e}`));
  } else {
    console.log("  \u2705 All data collected successfully");
  }
  console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
}

main().catch(console.error);
