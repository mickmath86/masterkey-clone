"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Home,
  Search,
  Clock,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Compass,
  LayoutGrid,
  MessageSquare,
  MoreHorizontal,
  Plus,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */
type MarketKey =
  | "thousand-oaks"
  | "camarillo"
  | "westlake"
  | "oxnard"
  | "ventura";

interface MarketSummary {
  medianPrice: string;
  medianChange: string;
  medianChangePositive: boolean;
  activeListings: number;
  avgDOM: number;
  avgDOMChange: string;
  avgDOMChangePositive: boolean;
  pricePerSqft: string;
  pricePerSqftChange: string;
  pricePerSqftChangePositive: boolean;
  sparkline: number[];
}

interface CompRecord {
  address: string;
  soldPrice: string;
  sqft: string;
  pricePerSqft: string;
  dom: number;
}

interface MarketData {
  label: string;
  summary: MarketSummary;
  comps: CompRecord[];
  marketSummaryText: string;
}

/* ═══════════════════════════════════════════════════════
   MOCK DATA (structured for future Perplexity API pull)
   ═══════════════════════════════════════════════════════ */
const marketsData: Record<MarketKey, MarketData> = {
  "thousand-oaks": {
    label: "Thousand Oaks",
    summary: {
      medianPrice: "$1,245,000",
      medianChange: "+4.2%",
      medianChangePositive: true,
      activeListings: 187,
      avgDOM: 28,
      avgDOMChange: "-3 days",
      avgDOMChangePositive: true,
      pricePerSqft: "$587",
      pricePerSqftChange: "+2.8%",
      pricePerSqftChangePositive: true,
      sparkline: [40, 42, 45, 43, 48, 52, 50, 55, 58, 62, 60, 65],
    },
    comps: [
      { address: "2841 Autumn Ridge Dr", soldPrice: "$1,350,000", sqft: "2,450", pricePerSqft: "$551", dom: 12 },
      { address: "1590 Calle Artigas", soldPrice: "$1,125,000", sqft: "1,980", pricePerSqft: "$568", dom: 8 },
      { address: "3267 Casino Dr", soldPrice: "$985,000", sqft: "1,650", pricePerSqft: "$597", dom: 21 },
      { address: "456 Erbes Rd", soldPrice: "$1,475,000", sqft: "2,800", pricePerSqft: "$527", dom: 15 },
      { address: "789 Westlake Blvd", soldPrice: "$1,680,000", sqft: "3,100", pricePerSqft: "$542", dom: 6 },
      { address: "1234 Avenida De Las Flores", soldPrice: "$1,050,000", sqft: "1,800", pricePerSqft: "$583", dom: 32 },
      { address: "5678 Lynn Rd", soldPrice: "$1,290,000", sqft: "2,200", pricePerSqft: "$586", dom: 18 },
      { address: "910 Hillcrest Dr", soldPrice: "$875,000", sqft: "1,450", pricePerSqft: "$603", dom: 45 },
    ],
    marketSummaryText:
      "Thousand Oaks continues to show strong seller conditions with median prices up 4.2% year-over-year. Active inventory remains tight at 187 listings, down from 215 last month. The luxury segment above $2M is seeing particularly strong demand with homes averaging only 14 days on market.",
  },
  camarillo: {
    label: "Camarillo",
    summary: {
      medianPrice: "$925,000",
      medianChange: "+3.6%",
      medianChangePositive: true,
      activeListings: 142,
      avgDOM: 34,
      avgDOMChange: "+2 days",
      avgDOMChangePositive: false,
      pricePerSqft: "$498",
      pricePerSqftChange: "+1.9%",
      pricePerSqftChangePositive: true,
      sparkline: [38, 40, 39, 42, 44, 43, 46, 48, 47, 50, 52, 51],
    },
    comps: [
      { address: "1482 Paseo Maravilla", soldPrice: "$879,000", sqft: "1,750", pricePerSqft: "$502", dom: 22 },
      { address: "2301 Via Loma", soldPrice: "$1,050,000", sqft: "2,100", pricePerSqft: "$500", dom: 14 },
      { address: "890 Corte Monterey", soldPrice: "$785,000", sqft: "1,520", pricePerSqft: "$516", dom: 38 },
      { address: "3456 Mission Oaks Blvd", soldPrice: "$1,175,000", sqft: "2,400", pricePerSqft: "$490", dom: 9 },
      { address: "567 Lantana St", soldPrice: "$825,000", sqft: "1,680", pricePerSqft: "$491", dom: 27 },
      { address: "2178 Ponderosa Dr", soldPrice: "$960,000", sqft: "1,900", pricePerSqft: "$505", dom: 19 },
      { address: "412 Arneill Rd", soldPrice: "$1,295,000", sqft: "2,650", pricePerSqft: "$489", dom: 11 },
      { address: "1029 Carmen Dr", soldPrice: "$710,000", sqft: "1,380", pricePerSqft: "$514", dom: 41 },
    ],
    marketSummaryText:
      "Camarillo remains a strong mid-range market with median prices holding at $925,000. Days on market have increased slightly, suggesting a gradual shift toward balance. New construction in the Springville development is adding inventory in the $800K–$1M range.",
  },
  westlake: {
    label: "Westlake Village",
    summary: {
      medianPrice: "$1,890,000",
      medianChange: "+6.8%",
      medianChangePositive: true,
      activeListings: 98,
      avgDOM: 22,
      avgDOMChange: "-5 days",
      avgDOMChangePositive: true,
      pricePerSqft: "$642",
      pricePerSqftChange: "+4.1%",
      pricePerSqftChangePositive: true,
      sparkline: [50, 54, 52, 58, 62, 60, 65, 68, 72, 75, 73, 78],
    },
    comps: [
      { address: "4521 Lakeview Canyon Rd", soldPrice: "$2,150,000", sqft: "3,400", pricePerSqft: "$632", dom: 8 },
      { address: "1892 Bridgegate St", soldPrice: "$1,750,000", sqft: "2,680", pricePerSqft: "$653", dom: 11 },
      { address: "3340 Lang Ranch Pkwy", soldPrice: "$1,425,000", sqft: "2,200", pricePerSqft: "$648", dom: 16 },
      { address: "678 Lakeshore Dr", soldPrice: "$3,200,000", sqft: "4,800", pricePerSqft: "$667", dom: 5 },
      { address: "2901 Townsgate Rd", soldPrice: "$1,680,000", sqft: "2,550", pricePerSqft: "$659", dom: 14 },
      { address: "1245 Hampshire Ct", soldPrice: "$2,450,000", sqft: "3,900", pricePerSqft: "$628", dom: 7 },
      { address: "560 N Westlake Blvd", soldPrice: "$1,975,000", sqft: "3,100", pricePerSqft: "$637", dom: 19 },
      { address: "834 Westlake Vista Ln", soldPrice: "$1,550,000", sqft: "2,350", pricePerSqft: "$660", dom: 10 },
    ],
    marketSummaryText:
      "Westlake Village leads the county in appreciation at +6.8% YoY. Luxury lakefront properties are seeing intense competition with multiple offers common above $2M. Inventory is historically low at just 98 active listings, creating significant upward price pressure.",
  },
  oxnard: {
    label: "Oxnard",
    summary: {
      medianPrice: "$725,000",
      medianChange: "+2.1%",
      medianChangePositive: true,
      activeListings: 234,
      avgDOM: 38,
      avgDOMChange: "+4 days",
      avgDOMChangePositive: false,
      pricePerSqft: "$445",
      pricePerSqftChange: "+0.8%",
      pricePerSqftChangePositive: true,
      sparkline: [35, 36, 37, 36, 38, 39, 38, 40, 41, 40, 42, 43],
    },
    comps: [
      { address: "1520 S Victoria Ave", soldPrice: "$680,000", sqft: "1,520", pricePerSqft: "$447", dom: 28 },
      { address: "3421 Olds Rd", soldPrice: "$595,000", sqft: "1,280", pricePerSqft: "$465", dom: 42 },
      { address: "890 Channel Islands Blvd", soldPrice: "$825,000", sqft: "1,850", pricePerSqft: "$446", dom: 19 },
      { address: "2145 Camino Del Sol", soldPrice: "$750,000", sqft: "1,680", pricePerSqft: "$446", dom: 33 },
      { address: "456 E Gonzales Rd", soldPrice: "$620,000", sqft: "1,350", pricePerSqft: "$459", dom: 51 },
      { address: "1789 Rubens Pl", soldPrice: "$875,000", sqft: "2,100", pricePerSqft: "$417", dom: 14 },
      { address: "3012 Saviers Rd", soldPrice: "$545,000", sqft: "1,180", pricePerSqft: "$462", dom: 36 },
      { address: "678 Wooley Rd", soldPrice: "$710,000", sqft: "1,600", pricePerSqft: "$444", dom: 25 },
    ],
    marketSummaryText:
      "Oxnard offers the most affordable entry point in Ventura County at a $725,000 median. Days on market have increased to 38 days, indicating a more balanced market compared to neighboring cities. First-time buyer activity is strong in the sub-$700K segment.",
  },
  ventura: {
    label: "Ventura",
    summary: {
      medianPrice: "$985,000",
      medianChange: "+3.9%",
      medianChangePositive: true,
      activeListings: 168,
      avgDOM: 30,
      avgDOMChange: "-1 day",
      avgDOMChangePositive: true,
      pricePerSqft: "$552",
      pricePerSqftChange: "+2.4%",
      pricePerSqftChangePositive: true,
      sparkline: [42, 44, 43, 46, 48, 50, 49, 52, 54, 56, 55, 58],
    },
    comps: [
      { address: "1245 Poli St", soldPrice: "$1,150,000", sqft: "2,100", pricePerSqft: "$548", dom: 15 },
      { address: "3890 Loma Vista Rd", soldPrice: "$875,000", sqft: "1,580", pricePerSqft: "$554", dom: 22 },
      { address: "567 E Main St", soldPrice: "$1,025,000", sqft: "1,850", pricePerSqft: "$554", dom: 18 },
      { address: "2134 Pierpont Blvd", soldPrice: "$1,450,000", sqft: "2,600", pricePerSqft: "$558", dom: 9 },
      { address: "890 San Jon Rd", soldPrice: "$780,000", sqft: "1,400", pricePerSqft: "$557", dom: 31 },
      { address: "1678 Thompson Blvd", soldPrice: "$925,000", sqft: "1,700", pricePerSqft: "$544", dom: 26 },
      { address: "345 Kalorama St", soldPrice: "$1,290,000", sqft: "2,350", pricePerSqft: "$549", dom: 12 },
      { address: "4512 Telegraph Rd", soldPrice: "$695,000", sqft: "1,250", pricePerSqft: "$556", dom: 38 },
    ],
    marketSummaryText:
      "Ventura's beachside neighborhoods continue to command premium pricing, with the Pierpont area seeing 5.2% appreciation. The downtown corridor is benefiting from new mixed-use developments driving buyer interest. Overall market conditions favor sellers with tight inventory.",
  },
};

/* right sidebar data */
const trendingNeighborhoods = [
  { name: "North Ranch", area: "Westlake Village", change: "+8.2%", positive: true },
  { name: "Dos Vientos", area: "Newbury Park", change: "+6.5%", positive: true },
  { name: "Lynn Ranch", area: "Thousand Oaks", change: "+5.8%", positive: true },
  { name: "Pierpont", area: "Ventura", change: "+5.2%", positive: true },
];

const recentActivity = [
  { type: "New listing", address: "2841 Autumn Ridge Dr, Thousand Oaks", price: "$1,350,000" },
  { type: "Price reduced", address: "890 Corte Monterey, Camarillo", price: "$785,000 → $765,000" },
  { type: "Sold", address: "678 Lakeshore Dr, Westlake Village", price: "$3,200,000" },
  { type: "New listing", address: "1520 S Victoria Ave, Oxnard", price: "$680,000" },
];

const marketIndicators = [
  { label: "Ventura County Median", value: "$965,000", change: "+3.8%", positive: true },
  { label: "Active Inventory", value: "829", change: "-4.2%", positive: true },
  { label: "Avg Days on Market", value: "31", change: "-2 days", positive: true },
  { label: "List-to-Sale Ratio", value: "98.7%", change: "+0.3%", positive: true },
  { label: "Months of Supply", value: "2.1", change: "-0.3", positive: true },
  { label: "New Listings (30d)", value: "412", change: "+8.1%", positive: false },
];

const propertyTypes = [
  { label: "Single Family", value: "$1,050,000", change: "+4.1%", positive: true },
  { label: "Condo/Townhome", value: "$625,000", change: "+2.8%", positive: true },
  { label: "Multi-Family", value: "$1,450,000", change: "+1.2%", positive: true },
  { label: "Luxury ($2M+)", value: "$2,850,000", change: "+6.5%", positive: true },
  { label: "New Construction", value: "$875,000", change: "+3.2%", positive: true },
];

const markets: { key: MarketKey; label: string }[] = [
  { key: "thousand-oaks", label: "Thousand Oaks" },
  { key: "camarillo", label: "Camarillo" },
  { key: "westlake", label: "Westlake Village" },
  { key: "oxnard", label: "Oxnard" },
  { key: "ventura", label: "Ventura" },
];

/* ═══════════════════════════════════════════════════════
   DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function MarketPulseDashboard() {
  const [activeMarket, setActiveMarket] = useState<MarketKey>("thousand-oaks");
  const data = marketsData[activeMarket];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#FAFAF8]">
      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="hidden lg:flex flex-col w-[200px] flex-shrink-0 bg-[#F5F3F0] border-r border-gray-200 py-5 px-3 overflow-y-auto">
        {/* brand */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 mb-5"
        >
          <BarChart3 className="w-5 h-5 text-mk-teal" />
          <span className="text-sm font-medium text-gray-900">
            MarketPulse
          </span>
        </Link>

        {/* search */}
        <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg bg-white text-sm text-gray-500 mb-1 hover:bg-gray-50 transition-colors">
          <Search className="w-4 h-4" />
          Search
        </button>

        {/* nav items */}
        <nav className="flex flex-col gap-0.5 mt-2">
          <SidebarLink icon={<Home className="w-4 h-4" />} label="Dashboard" active />
          <SidebarLink icon={<Clock className="w-4 h-4" />} label="History" />
          <SidebarLink icon={<Compass className="w-4 h-4" />} label="Discover" />
          <SidebarLink icon={<LayoutGrid className="w-4 h-4" />} label="Reports" />
          <SidebarLink icon={<BarChart3 className="w-4 h-4" />} label="Markets" active={false} />
          <SidebarLink icon={<MoreHorizontal className="w-4 h-4" />} label="More" />
        </nav>

        {/* recent */}
        <div className="mt-6 px-3">
          <p className="text-xs font-medium text-gray-400 mb-2">Recent</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Recent searches and reports will appear here.
          </p>
        </div>
      </aside>

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
            <button className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3" />
              Share
            </button>
          </div>

          {/* market tabs */}
          <div className="flex items-center justify-between px-6 pb-0">
            <div className="flex items-center gap-1 overflow-x-auto">
              {markets.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveMarket(m.key)}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-[3px] transition-colors ${
                    activeMarket === m.key
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
          {/* TOP ASSETS row */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">
              {data.label} · Key Metrics
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard
                label="Median Price"
                value={data.summary.medianPrice}
                change={data.summary.medianChange}
                positive={data.summary.medianChangePositive}
                sparkline={data.summary.sparkline}
              />
              <MetricCard
                label="Active Listings"
                value={String(data.summary.activeListings)}
                change={data.summary.activeListings < 150 ? "Low inventory" : "Moderate"}
                positive={data.summary.activeListings < 150}
                badge
              />
              <MetricCard
                label="Avg Days on Market"
                value={String(data.summary.avgDOM)}
                change={data.summary.avgDOMChange}
                positive={data.summary.avgDOMChangePositive}
              />
              <MetricCard
                label="Price / Sq Ft"
                value={data.summary.pricePerSqft}
                change={data.summary.pricePerSqftChange}
                positive={data.summary.pricePerSqftChangePositive}
              />
            </div>
          </div>

          {/* MARKET SUMMARY */}
          <MarketSummarySection
            text={data.marketSummaryText}
            market={data.label}
          />

          {/* RECENT COMPS TABLE */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-900">
                Recent Comps · {data.label}
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
                    {data.comps.map((comp, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {comp.address}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                          {comp.soldPrice}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          {comp.sqft}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          {comp.pricePerSqft}
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

          {/* ask anything bar */}
          <div className="mt-6 mb-4">
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
              <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-sm text-gray-400">
                Ask anything about {data.label} real estate...
              </span>
              <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ─── RIGHT SIDEBAR ─── */}
      <aside className="hidden xl:block w-[320px] flex-shrink-0 bg-[#FAFAF8] border-l border-gray-200 overflow-y-auto py-5 px-4">
        {/* Trending Neighborhoods */}
        <RightSidebarSection title="Trending Neighborhoods">
          <div className="space-y-0">
            {trendingNeighborhoods.map((n) => (
              <div
                key={n.name}
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
                  {n.change}
                </span>
              </div>
            ))}
          </div>
        </RightSidebarSection>

        {/* Recent Activity */}
        <RightSidebarSection title="Recent Activity">
          <div className="space-y-0">
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className="py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      a.type === "Sold"
                        ? "bg-mk-green/10 text-mk-green"
                        : a.type === "Price reduced"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-mk-blue/10 text-mk-blue"
                    }`}
                  >
                    {a.type}
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
                key={ind.label}
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
                key={pt.label}
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
                    {pt.positive ? "↑" : "↓"} {pt.change}
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
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function SidebarLink({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-white font-medium text-gray-900 shadow-sm"
          : "text-gray-600 hover:bg-white/60"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

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
        {/* mini sparkline */}
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
