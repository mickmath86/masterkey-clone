"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  MessageSquare,
  Plus,
  ExternalLink,
  Check,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type {
  MarketKey,
  Market,
  MarketSnapshot,
  Comp,
  PriceHistoryRow,
  TrendingNeighborhood,
  RecentActivityItem,
  CountyIndicator,
  PropertyTypeBreakdown,
  NewsArticle as DBNewsArticle,
} from "@/lib/types";
import {
  getMarkets,
  getAllLatestSnapshots,
  getComps,
  getPriceHistory,
  getTrendingNeighborhoods,
  getRecentActivity,
  getCountyIndicators,
  getPropertyTypeBreakdown,
  getNewsArticles,
} from "@/lib/queries";

/* ═══════════════════════════════════════════════════════
   LOCAL UI TYPES (used by sub-components)
   ═══════════════════════════════════════════════════════ */
type PropertyType = "sfr" | "condo" | "townhome";
type TimeframeKey = "1M" | "3M" | "6M" | "1Y" | "5Y" | "ALL";

interface MonthlyPriceData {
  month: string;
  sfr: number;
  condo: number;
  townhome: number;
}

/* ═══════════════════════════════════════════════════════
   UI CONSTANTS (kept — not data)
   ═══════════════════════════════════════════════════════ */
const PROPERTY_TYPE_CONFIG: Record<PropertyType, { label: string; color: string }> = {
  sfr: { label: "Single Family", color: "#1A4D4D" },
  condo: { label: "Condos", color: "#00a5ef" },
  townhome: { label: "Townhomes", color: "#00c758" },
};

const TIMEFRAMES: { key: TimeframeKey; label: string; months: number }[] = [
  { key: "1M", label: "1M", months: 1 },
  { key: "3M", label: "3M", months: 3 },
  { key: "6M", label: "6M", months: 6 },
  { key: "1Y", label: "1Y", months: 12 },
  { key: "5Y", label: "5Y", months: 60 },
  { key: "ALL", label: "All", months: 999 },
];

/* ═══════════════════════════════════════════════════════
   FORMATTING HELPERS
   ═══════════════════════════════════════════════════════ */
function formatCurrency(value: number): string {
  return "$" + value.toLocaleString("en-US");
}

function formatPctChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function MarketPulseDashboard() {
  /* ─── state: market selection ─── */
  const [activeMarket, setActiveMarket] = useState<MarketKey>("thousand-oaks");

  /* ─── state: data from Supabase ─── */
  const [markets, setMarkets] = useState<Market[]>([]);
  const [snapshots, setSnapshots] = useState<Record<string, MarketSnapshot>>({});
  const [comps, setComps] = useState<Comp[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryRow[]>([]);
  const [trendingNeighborhoods, setTrendingNeighborhoods] = useState<TrendingNeighborhood[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [marketIndicators, setMarketIndicators] = useState<CountyIndicator[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeBreakdown[]>([]);
  const [newsArticles, setNewsArticles] = useState<DBNewsArticle[]>([]);

  /* ─── state: loading ─── */
  const [initialLoading, setInitialLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(false);

  /* ─── fetch sidebar + global data once on mount ─── */
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [
          marketsRes,
          snapshotsRes,
          trendingRes,
          activityRes,
          indicatorsRes,
          propTypesRes,
          newsRes,
        ] = await Promise.all([
          getMarkets(),
          getAllLatestSnapshots(),
          getTrendingNeighborhoods(),
          getRecentActivity(),
          getCountyIndicators(),
          getPropertyTypeBreakdown(),
          getNewsArticles(),
        ]);

        setMarkets(marketsRes);
        setSnapshots(snapshotsRes);
        setTrendingNeighborhoods(trendingRes);
        setRecentActivity(activityRes);
        setMarketIndicators(indicatorsRes);
        setPropertyTypes(propTypesRes);
        setNewsArticles(newsRes);

        // Also fetch comps + price history for the default market
        const [compsRes, phRes] = await Promise.all([
          getComps("thousand-oaks"),
          getPriceHistory("thousand-oaks"),
        ]);
        setComps(compsRes);
        setPriceHistory(phRes);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setInitialLoading(false);
      }
    }

    loadInitialData();
  }, []);

  /* ─── fetch market-specific data when activeMarket changes ─── */
  useEffect(() => {
    // Skip the initial market since we fetch it above
    if (initialLoading) return;

    let cancelled = false;

    async function loadMarketData() {
      setMarketLoading(true);
      try {
        const [compsRes, phRes] = await Promise.all([
          getComps(activeMarket),
          getPriceHistory(activeMarket),
        ]);
        if (!cancelled) {
          setComps(compsRes);
          setPriceHistory(phRes);
        }
      } catch (err) {
        console.error("Failed to load market data:", err);
      } finally {
        if (!cancelled) setMarketLoading(false);
      }
    }

    loadMarketData();
    return () => {
      cancelled = true;
    };
  }, [activeMarket, initialLoading]);

  /* ─── derive current snapshot ─── */
  const snapshot: MarketSnapshot | null = snapshots[activeMarket] ?? null;

  /* ─── derive label for current market ─── */
  const marketLabel =
    markets.find((m) => m.id === activeMarket)?.label ?? activeMarket;

  /* ─── map price history rows → chart format ─── */
  const chartData: MonthlyPriceData[] = priceHistory.map((row) => ({
    month: row.month_label,
    sfr: row.sfr,
    condo: row.condo,
    townhome: row.townhome,
  }));

  /* ─── loading skeleton ─── */
  if (initialLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1A4D4D]" />
          <span className="text-sm text-gray-500">Loading MarketPulse...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 overflow-y-auto">
        {/* top header bar */}
        <div className="sticky top-0 z-10 bg-[#FAFAF8] border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-3">
            <span className="text-base font-medium text-gray-900">
              MasterKey MarketPulse
            </span>
            <div className="flex-1 max-w-[400px] mx-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm text-gray-400">
                <Search className="w-4 h-4" />
                Search neighborhoods, addresses, and more...
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SentimentBar score={snapshot?.sentiment_score ?? 50} />
              <button className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <ExternalLink className="w-3 h-3" />
                Share
              </button>
            </div>
          </div>

          {/* market tabs */}
          <div className="flex items-center justify-between px-6 pb-0">
            <div className="flex items-center gap-1 overflow-x-auto">
              {markets.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMarket(m.id)}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-[3px] transition-colors ${
                    activeMarket === m.id
                      ? "text-gray-900 border-mk-teal"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 flex-shrink-0 pb-2">
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-mk-green" />
                Updated today
              </span>
              <span>·</span>
              <span>Ventura County, CA</span>
            </div>
          </div>
        </div>

        {/* main scrollable content */}
        <div className="px-6 py-6">
          {marketLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-[#1A4D4D]" />
            </div>
          ) : (
            <>
              {/* TOP ASSETS row */}
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-900 mb-3">
                  {marketLabel} · Key Metrics
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard
                    label="Median Price"
                    value={snapshot ? formatCurrency(snapshot.median_price) : "—"}
                    change={snapshot ? formatPctChange(snapshot.median_change_pct) : "—"}
                    positive={snapshot?.median_change_positive ?? true}
                    sparkline={snapshot?.sparkline}
                  />
                  <MetricCard
                    label="Active Listings"
                    value={snapshot ? String(snapshot.active_listings) : "—"}
                    change={
                      snapshot
                        ? snapshot.active_listings < 150
                          ? "Low inventory"
                          : "Moderate"
                        : "—"
                    }
                    positive={snapshot ? snapshot.active_listings < 150 : true}
                    badge
                  />
                  <MetricCard
                    label="Avg Days on Market"
                    value={snapshot ? String(snapshot.avg_dom) : "—"}
                    change={snapshot?.avg_dom_change ?? "—"}
                    positive={snapshot?.avg_dom_change_positive ?? true}
                  />
                  <MetricCard
                    label="Price / Sq Ft"
                    value={snapshot ? formatCurrency(snapshot.price_per_sqft) : "—"}
                    change={
                      snapshot
                        ? formatPctChange(snapshot.price_per_sqft_change_pct)
                        : "—"
                    }
                    positive={snapshot?.price_per_sqft_change_positive ?? true}
                  />
                </div>
              </div>

              {/* MARKET SUMMARY */}
              <MarketSummarySection
                text={snapshot?.market_summary_text ?? ""}
                market={marketLabel}
              />

              {/* MEDIAN PRICE LINE CHART */}
              <div className="mt-6">
                <MedianPriceChart
                  priceHistory={chartData}
                  marketLabel={marketLabel}
                />
              </div>

              {/* RECENT COMPS TABLE */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-gray-900">
                    Recent Comps · {marketLabel}
                  </h2>
                  <span className="text-xs text-gray-400">Last 30 days</span>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                            Address
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">
                            Sold Price
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">
                            SF
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">
                            Price/SF
                          </th>
                          <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">
                            DOM
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comps.map((comp) => (
                          <tr
                            key={comp.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {comp.address}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                              {formatCurrency(comp.sold_price)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right">
                              {formatNumber(comp.sqft)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right">
                              {formatCurrency(comp.price_per_sqft)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              <span
                                className={
                                  comp.dom <= 14
                                    ? "text-mk-green font-medium"
                                    : comp.dom <= 30
                                    ? "text-gray-600"
                                    : "text-amber-600"
                                }
                              >
                                {comp.dom}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* NEWS SECTION */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-gray-900">
                    Latest News
                  </h2>
                  <span className="text-xs text-gray-400">Powered by RSS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {newsArticles.map((article) => (
                    <a
                      key={article.id}
                      href={article.article_url}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
                        {article.image_url && (
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-mk-teal transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{article.source}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.published_date}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* ask anything bar */}
              <div className="mt-6 mb-4">
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-sm text-gray-400">
                    Ask anything about {marketLabel} real estate...
                  </span>
                  <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ─── RIGHT SIDEBAR ─── */}
      <aside className="hidden xl:block w-[320px] flex-shrink-0 bg-[#FAFAF8] border-l border-gray-200 overflow-y-auto py-5 px-4">
        {/* Trending Neighborhoods */}
        <RightSidebarSection title="Trending Neighborhoods">
          <div className="space-y-0">
            {trendingNeighborhoods.map((n) => (
              <div
                key={n.id}
                className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm text-gray-900">{n.name}</p>
                  <p className="text-xs text-gray-400">{n.area}</p>
                </div>
                <span
                  className={`text-xs font-medium flex items-center gap-0.5 ${
                    n.positive ? "text-mk-green" : "text-red-500"
                  }`}
                >
                  {n.positive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {n.change_pct}
                </span>
              </div>
            ))}
          </div>
        </RightSidebarSection>

        {/* Recent Activity */}
        <RightSidebarSection title="Recent Activity">
          <div className="space-y-0">
            {recentActivity.map((a) => (
              <div
                key={a.id}
                className="py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      a.activity_type === "Sold"
                        ? "bg-mk-green/10 text-mk-green"
                        : a.activity_type === "Price reduced"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-mk-blue/10 text-mk-blue"
                    }`}
                  >
                    {a.activity_type}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {a.address}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{a.price}</p>
              </div>
            ))}
          </div>
        </RightSidebarSection>

        {/* Market Indicators */}
        <RightSidebarSection title="Ventura County Indicators">
          <div className="space-y-0">
            {marketIndicators.map((ind) => (
              <div
                key={ind.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-xs text-gray-600">{ind.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900">
                    {ind.value}
                  </span>
                  <span
                    className={`text-[11px] font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                      ind.positive
                        ? "bg-green-50 text-mk-green"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {ind.positive ? (
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    ) : (
                      <ArrowDownRight className="w-2.5 h-2.5" />
                    )}
                    {ind.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </RightSidebarSection>

        {/* Property Types */}
        <RightSidebarSection title="By Property Type">
          <div className="space-y-0">
            {propertyTypes.map((pt) => (
              <div
                key={pt.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <span className="text-xs text-gray-600">{pt.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900">
                    {pt.value}
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      pt.positive ? "text-mk-green" : "text-red-500"
                    }`}
                  >
                    {pt.positive ? "↑" : "↓"} {pt.change_pct}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </RightSidebarSection>

        {/* footer disclaimer */}
        <div className="mt-6 px-1">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Data sourced from MLS, county assessor records, and public data feeds.
            Updated daily. All figures are estimates and should not be relied
            upon as a sole basis for investment decisions.
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SENTIMENT BAR INDICATOR — Equal height bars
   ═══════════════════════════════════════════════════════ */
function SentimentBar({ score }: { score: number }) {
  const totalBars = 10;
  const filledBars = Math.round((score / 100) * totalBars);
  const label = score >= 60 ? "Seller's Market" : score <= 40 ? "Buyer's Market" : "Balanced";

  function getBarColor(index: number, filled: boolean): string {
    if (!filled) return "#E5E7EB";
    const ratio = index / (totalBars - 1);
    if (ratio < 0.3) return "#EF4444";
    if (ratio < 0.5) return "#F59E0B";
    if (ratio < 0.7) return "#84CC16";
    return "#00c758";
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-[3px]" title={`Market Sentiment: ${score}/100`}>
        {Array.from({ length: totalBars }).map((_, i) => {
          const filled = i < filledBars;
          return (
            <div
              key={i}
              className="w-[3px] h-[16px] rounded-sm transition-all duration-300"
              style={{
                backgroundColor: getBarColor(i, filled),
              }}
            />
          );
        })}
      </div>
      <span
        className="text-xs font-semibold whitespace-nowrap"
        style={{
          color:
            score >= 60
              ? "#00c758"
              : score <= 40
              ? "#EF4444"
              : "#F59E0B",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MEDIAN PRICE LINE CHART — Recharts
   ═══════════════════════════════════════════════════════ */
function MedianPriceChart({
  priceHistory,
  marketLabel,
}: {
  priceHistory: MonthlyPriceData[];
  marketLabel: string;
}) {
  const [activeTypes, setActiveTypes] = useState<Set<PropertyType>>(
    new Set(["sfr", "condo", "townhome"])
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeKey>("1Y");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleType(type: PropertyType) {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  // Filter data by timeframe
  const tf = TIMEFRAMES.find((t) => t.key === timeframe)!;
  const slicedData = priceHistory.slice(-Math.min(tf.months, priceHistory.length));

  function formatPrice(val: number): string {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${(val / 1000).toFixed(0)}K`;
  }

  const activeTypeArr = Array.from(activeTypes);

  // Custom tooltip
  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">
              {PROPERTY_TYPE_CONFIG[entry.dataKey as PropertyType]?.label}:
            </span>
            <span className="font-medium text-gray-900">
              {formatPrice(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-medium text-gray-900">
          Median Home Price · {marketLabel}
        </h2>
        <div className="flex items-center gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                onClick={() => setTimeframe(tf.key)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  timeframe === tf.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Property type dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Property Types
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                {(Object.keys(PROPERTY_TYPE_CONFIG) as PropertyType[]).map(
                  (type) => {
                    const config = PROPERTY_TYPE_CONFIG[type];
                    const isActive = activeTypes.has(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
                          style={{
                            borderColor: isActive ? config.color : "#D1D5DB",
                            backgroundColor: isActive ? config.color : "transparent",
                          }}
                        >
                          {isActive && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-[2px] rounded-full"
                            style={{ backgroundColor: config.color }}
                          />
                          <span className="text-gray-700">{config.label}</span>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-2">
        {activeTypeArr.map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className="w-3 h-[2px] rounded-full"
              style={{ backgroundColor: PROPERTY_TYPE_CONFIG[type].color }}
            />
            <span className="text-[11px] text-gray-500">
              {PROPERTY_TYPE_CONFIG[type].label}
            </span>
          </div>
        ))}
      </div>

      {/* Recharts Line Chart */}
      <div className="w-full" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={slicedData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatPrice}
              width={60}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            {activeTypeArr.map((type) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={PROPERTY_TYPE_CONFIG[type].color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: "white" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function MetricCard({
  label,
  value,
  change,
  positive,
  sparkline,
  badge,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  sparkline?: number[];
  badge?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            {badge ? (
              <span
                className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                  positive
                    ? "bg-amber-50 text-amber-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {change}
              </span>
            ) : (
              <span
                className={`text-xs font-medium flex items-center gap-0.5 ${
                  positive ? "text-mk-green" : "text-red-500"
                }`}
              >
                {positive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {change}
              </span>
            )}
          </div>
        </div>
        {sparkline && (
          <div className="flex items-end gap-[2px] h-8">
            {sparkline.map((v, i) => (
              <div
                key={i}
                className="w-[4px] rounded-t bg-mk-teal/60"
                style={{ height: `${(v / Math.max(...sparkline)) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MarketSummarySection({
  text,
  market,
}: {
  text: string;
  market: string;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900">
            Market Summary
          </span>
          <span className="text-xs text-gray-400">Updated 1 minute ago</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-[9px] text-gray-500">
                AI
              </span>
              Powered by Perplexity
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function RightSidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}
