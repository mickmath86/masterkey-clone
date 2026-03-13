/**
 * MarketPulse Data Pipeline
 * 
 * Fetches real market data for 5 Ventura County cities using the Perplexity Sonar API
 * and writes it to Supabase.
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
  { id: "thousand-oaks", label: "Thousand Oaks" },
  { id: "camarillo", label: "Camarillo" },
  { id: "westlake", label: "Westlake Village" },
  { id: "oxnard", label: "Oxnard" },
  { id: "ventura", label: "Ventura" },
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
          content: "You are a real estate data analyst. Return accurate, current data based on your web search results. Use real data from Redfin, Zillow, Realtor.com, MLS, and public records. All prices should be in whole dollar amounts (no cents). If you cannot find exact data for a field, provide your best estimate based on available data and clearly note it."
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
    median_price: { type: "integer", description: "Current median home price in whole dollars" },
    median_change_pct: { type: "number", description: "Year-over-year change in median price as a percentage (e.g. 4.2 for +4.2%)" },
    active_listings: { type: "integer", description: "Number of currently active listings" },
    avg_dom: { type: "integer", description: "Average days on market for sold homes" },
    avg_dom_change: { type: "string", description: "Change in DOM from previous period, e.g. '-3 days' or '+2 days'" },
    price_per_sqft: { type: "integer", description: "Median price per square foot in whole dollars" },
    price_per_sqft_change_pct: { type: "number", description: "YoY change in price per sqft as percentage" },
    sentiment_score: { type: "integer", description: "Market sentiment 0-100 where 0=strong buyer's market, 50=balanced, 100=strong seller's market" },
    market_summary: { type: "string", description: "2-3 sentence summary of current market conditions, trends, and notable factors" },
  },
  required: ["median_price", "median_change_pct", "active_listings", "avg_dom", "avg_dom_change", "price_per_sqft", "price_per_sqft_change_pct", "sentiment_score", "market_summary"],
};

const compsSchema = {
  type: "object",
  properties: {
    comps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          address: { type: "string", description: "Street address (no city/state)" },
          sold_price: { type: "integer", description: "Sale price in whole dollars" },
          sqft: { type: "integer", description: "Square footage" },
          price_per_sqft: { type: "integer", description: "Price per square foot" },
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
    county_median: { type: "string", description: "County-wide median home price, e.g. '$965,000'" },
    county_median_change: { type: "string", description: "YoY change, e.g. '+3.8%'" },
    active_inventory: { type: "string", description: "Total active listings county-wide" },
    inventory_change: { type: "string", description: "Change in inventory, e.g. '-4.2%'" },
    avg_dom: { type: "string", description: "County avg days on market" },
    dom_change: { type: "string", description: "Change in DOM, e.g. '-2 days'" },
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

/* ─── Data collection functions ─── */

async function collectMarketSnapshot(marketId: string, marketLabel: string) {
  console.log(`  \uD83D\uDCCA Fetching snapshot for ${marketLabel}...`);
  const data = await askPerplexity(
    `What are the current real estate market statistics for ${marketLabel}, California as of ${today}? I need: median home sale price, year-over-year change percentage, number of active listings, average days on market, change in DOM from last year, median price per square foot, YoY change in price per sqft, and a market sentiment score (0=buyer's market, 100=seller's market). Also write a 2-3 sentence market summary.`,
    "market_snapshot",
    marketSnapshotSchema,
  );

  const isPositive = (val: number) => val >= 0;
  const domPositive = data.avg_dom_change?.startsWith("-"); // fewer days = positive for sellers

  await supabase.from("market_snapshots").upsert({
    market_id: marketId,
    snapshot_date: today,
    median_price: data.median_price,
    median_change_pct: data.median_change_pct,
    median_change_positive: isPositive(data.median_change_pct),
    active_listings: data.active_listings,
    avg_dom: data.avg_dom,
    avg_dom_change: data.avg_dom_change,
    avg_dom_change_positive: domPositive,
    price_per_sqft: data.price_per_sqft,
    price_per_sqft_change_pct: data.price_per_sqft_change_pct,
    price_per_sqft_change_positive: isPositive(data.price_per_sqft_change_pct),
    sparkline: [], // will be computed from price_history later
    sentiment_score: Math.max(0, Math.min(100, data.sentiment_score)),
    market_summary_text: data.market_summary,
  }, { onConflict: "market_id,snapshot_date" });

  console.log(`  \u2705 ${marketLabel} snapshot saved`);
}

async function collectComps(marketId: string, marketLabel: string) {
  console.log(`  \uD83C\uDFE0 Fetching comps for ${marketLabel}...`);
  const data = await askPerplexity(
    `What are the 8 most recent residential home sales (closed transactions) in ${marketLabel}, California? For each sale I need: street address, sale price, square footage, price per square foot, and days on market. Focus on sales from the last 30 days. Use real addresses and real sale data.`,
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
    `What are the monthly median home prices in ${marketLabel}, California for each of the last 12 months? Break it down by property type: single family homes (SFR), condos, and townhomes. Give me the month label (e.g. "Apr '25"), the date in YYYY-MM-DD format, and the median price for each type.`,
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
    `What are the current Ventura County, California overall real estate market indicators? I need:
    1. County-wide median home price and YoY change
    2. Total active inventory count and change
    3. Average days on market and change
    4. List-to-sale price ratio and change
    5. Months of housing supply and change
    6. New listings in last 30 days and change
    7. Top 4 appreciating neighborhoods in Ventura County with their city and YoY price appreciation percentage
    8. Median prices by property type: Single Family, Condo/Townhome, Multi-Family, Luxury ($2M+), and New Construction, each with YoY change`,
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
  console.log("  MarketPulse Data Pipeline");
  console.log(`  Date: ${today}`);
  console.log("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n");

  const startTime = Date.now();
  const errors: string[] = [];

  // Log the pipeline run
  const { data: logEntry } = await supabase.from("data_pipeline_log").insert({
    source: "perplexity_api",
    status: "running",
    markets_updated: MARKETS.map((m) => m.id),
    tables_updated: ["market_snapshots", "comps", "price_history", "county_indicators", "trending_neighborhoods", "property_type_breakdown"],
  }).select().single();

  // Collect data for each market
  for (const market of MARKETS) {
    console.log(`\n\u2500\u2500 ${market.label} \u2500\u2500`);
    try {
      await collectMarketSnapshot(market.id, market.label);
    } catch (e: any) {
      console.error(`  \u274C Snapshot failed: ${e.message}`);
      errors.push(`${market.label} snapshot: ${e.message}`);
    }

    try {
      await collectComps(market.id, market.label);
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
