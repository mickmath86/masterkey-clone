"use client";

import { useState, useRef, useEffect } from "react";
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
  Check,
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

type PropertyType = "sfr" | "condo" | "townhome";

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

interface MonthlyPriceData {
  month: string;
  sfr: number;
  condo: number;
  townhome: number;
}

interface MarketData {
  label: string;
  summary: MarketSummary;
  comps: CompRecord[];
  marketSummaryText: string;
  priceHistory: MonthlyPriceData[];
  /** 0 = full buyer's market, 100 = full seller's market */
  sentimentScore: number;
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
    priceHistory: [
      { month: "Apr", sfr: 1150000, condo: 625000, townhome: 720000 },
      { month: "May", sfr: 1165000, condo: 630000, townhome: 728000 },
      { month: "Jun", sfr: 1180000, condo: 640000, townhome: 735000 },
      { month: "Jul", sfr: 1195000, condo: 635000, townhome: 740000 },
      { month: "Aug", sfr: 1210000, condo: 645000, townhome: 750000 },
      { month: "Sep", sfr: 1220000, condo: 650000, townhome: 755000 },
      { month: "Oct", sfr: 1205000, condo: 648000, townhome: 745000 },
      { month: "Nov", sfr: 1215000, condo: 655000, townhome: 758000 },
      { month: "Dec", sfr: 1230000, condo: 660000, townhome: 762000 },
      { month: "Jan", sfr: 1235000, condo: 658000, townhome: 768000 },
      { month: "Feb", sfr: 1240000, condo: 665000, townhome: 775000 },
      { month: "Mar", sfr: 1245000, condo: 670000, townhome: 780000 },
    ],
    sentimentScore: 72,
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
    priceHistory: [
      { month: "Apr", sfr: 870000, condo: 510000, townhome: 590000 },
      { month: "May", sfr: 878000, condo: 515000, townhome: 595000 },
      { month: "Jun", sfr: 885000, condo: 520000, townhome: 602000 },
      { month: "Jul", sfr: 890000, condo: 518000, townhome: 608000 },
      { month: "Aug", sfr: 898000, condo: 525000, townhome: 612000 },
      { month: "Sep", sfr: 905000, condo: 530000, townhome: 618000 },
      { month: "Oct", sfr: 900000, condo: 528000, townhome: 615000 },
      { month: "Nov", sfr: 908000, condo: 535000, townhome: 622000 },
      { month: "Dec", sfr: 912000, condo: 538000, townhome: 628000 },
      { month: "Jan", sfr: 918000, condo: 540000, townhome: 632000 },
      { month: "Feb", sfr: 922000, condo: 545000, townhome: 638000 },
      { month: "Mar", sfr: 925000, condo: 548000, townhome: 642000 },
    ],
    sentimentScore: 58,
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
    priceHistory: [
      { month: "Apr", sfr: 1720000, condo: 850000, townhome: 1050000 },
      { month: "May", sfr: 1745000, condo: 858000, townhome: 1065000 },
      { month: "Jun", sfr: 1768000, condo: 865000, townhome: 1078000 },
      { month: "Jul", sfr: 1790000, condo: 870000, townhome: 1090000 },
      { month: "Aug", sfr: 1810000, condo: 878000, townhome: 1105000 },
      { month: "Sep", sfr: 1825000, condo: 885000, townhome: 1118000 },
      { month: "Oct", sfr: 1815000, condo: 880000, townhome: 1110000 },
      { month: "Nov", sfr: 1840000, condo: 890000, townhome: 1125000 },
      { month: "Dec", sfr: 1855000, condo: 895000, townhome: 1138000 },
      { month: "Jan", sfr: 1868000, condo: 900000, townhome: 1148000 },
      { month: "Feb", sfr: 1878000, condo: 908000, townhome: 1158000 },
      { month: "Mar", sfr: 1890000, condo: 915000, townhome: 1168000 },
    ],
    sentimentScore: 85,
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
    priceHistory: [
      { month: "Apr", sfr: 695000, condo: 420000, townhome: 498000 },
      { month: "May", sfr: 698000, condo: 422000, townhome: 502000 },
      { month: "Jun", sfr: 702000, condo: 425000, townhome: 505000 },
      { month: "Jul", sfr: 705000, condo: 423000, townhome: 508000 },
      { month: "Aug", sfr: 708000, condo: 428000, townhome: 510000 },
      { month: "Sep", sfr: 712000, condo: 430000, townhome: 515000 },
      { month: "Oct", sfr: 710000, condo: 428000, townhome: 512000 },
      { month: "Nov", sfr: 715000, condo: 432000, townhome: 518000 },
      { month: "Dec", sfr: 718000, condo: 435000, townhome: 522000 },
      { month: "Jan", sfr: 720000, condo: 438000, townhome: 525000 },
      { month: "Feb", sfr: 722000, condo: 440000, townhome: 528000 },
      { month: "Mar", sfr: 725000, condo: 442000, townhome: 530000 },
    ],
    sentimentScore: 38,
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
    priceHistory: [
      { month: "Apr", sfr: 935000, condo: 548000, townhome: 645000 },
      { month: "May", sfr: 942000, condo: 552000, townhome: 650000 },
      { month: "Jun", sfr: 948000, condo: 558000, townhome: 658000 },
      { month: "Jul", sfr: 955000, condo: 555000, townhome: 662000 },
      { month: "Aug", sfr: 960000, condo: 562000, townhome: 668000 },
      { month: "Sep", sfr: 965000, condo: 568000, townhome: 675000 },
      { month: "Oct", sfr: 960000, condo: 565000, townhome: 670000 },
      { month: "Nov", sfr: 968000, condo: 572000, townhome: 678000 },
      { month: "Dec", sfr: 975000, condo: 578000, townhome: 685000 },
      { month: "Jan", sfr: 978000, condo: 580000, townhome: 690000 },
      { month: "Feb", sfr: 982000, condo: 585000, townhome: 695000 },
      { month: "Mar", sfr: 985000, condo: 588000, townhome: 698000 },
    ],
    sentimentScore: 65,
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

const PROPERTY_TYPE_CONFIG: Record<PropertyType, { label: string; color: string }> = {
  sfr: { label: "Single Family", color: "#1A4D4D" },
  condo: { label: "Condos", color: "#00a5ef" },
  townhome: { label: "Townhomes", color: "#00c758" },
};

/* ═══════════════════════════════════════════════════════
   DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function MarketPulseDashboard() {
  const [activeMarket, setActiveMarket] = useState<MarketKey>("thousand-oaks");
  const data = marketsData[activeMarket];

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#FAFAF8]">
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
              <SentimentBar score={data.sentimentScore} />
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

          {/* MEDIAN PRICE LINE CHART */}
          <div className="mt-6">
            <MedianPriceChart
              priceHistory={data.priceHistory}
              marketLabel={data.label}
            />
          </div>

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
   SENTIMENT BAR INDICATOR
   ═══════════════════════════════════════════════════════ */
function SentimentBar({ score }: { score: number }) {
  const totalBars = 10;
  const filledBars = Math.round((score / 100) * totalBars);
  const label = score >= 60 ? "Seller's Market" : score <= 40 ? "Buyer's Market" : "Balanced";

  /**
   * Color gradient: bars fill left-to-right.
   * Left side (buyer) = red tones, right side (seller) = green tones.
   * Each bar gets a color based on its position in the filled range.
   */
  function getBarColor(index: number, filled: boolean): string {
    if (!filled) return "#E5E7EB"; // gray-200
    // Gradient from red → amber → green across the filled portion
    const ratio = index / (totalBars - 1);
    if (ratio < 0.3) return "#EF4444";      // red
    if (ratio < 0.5) return "#F59E0B";      // amber
    if (ratio < 0.7) return "#84CC16";      // lime
    return "#00c758";                        // mk-green
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-[3px]" title={`Market Sentiment: ${score}/100`}>
        {Array.from({ length: totalBars }).map((_, i) => {
          const filled = i < filledBars;
          return (
            <div
              key={i}
              className="w-[3px] rounded-sm transition-all duration-300"
              style={{
                height: `${12 + i * 1.2}px`,
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
   MEDIAN PRICE LINE CHART
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
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
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

  // Chart dimensions
  const chartW = 800;
  const chartH = 260;
  const padTop = 20;
  const padBottom = 36;
  const padLeft = 64;
  const padRight = 20;
  const plotW = chartW - padLeft - padRight;
  const plotH = chartH - padTop - padBottom;

  // Calculate min/max across active types
  const activeTypeArr = Array.from(activeTypes);
  let allValues: number[] = [];
  for (const t of activeTypeArr) {
    allValues = allValues.concat(priceHistory.map((d) => d[t]));
  }
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const yMin = Math.floor(dataMin * 0.95 / 10000) * 10000;
  const yMax = Math.ceil(dataMax * 1.02 / 10000) * 10000;
  const yRange = yMax - yMin || 1;

  function xPos(i: number): number {
    return padLeft + (i / (priceHistory.length - 1)) * plotW;
  }
  function yPos(val: number): number {
    return padTop + plotH - ((val - yMin) / yRange) * plotH;
  }

  // Y-axis labels (5 ticks)
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) =>
    yMin + (yRange / (yTicks - 1)) * i
  );

  function formatPrice(val: number): string {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${(val / 1000).toFixed(0)}K`;
  }

  function buildPath(type: PropertyType): string {
    return priceHistory
      .map((d, i) => `${i === 0 ? "M" : "L"} ${xPos(i)} ${yPos(d[type])}`)
      .join(" ");
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-900">
          Median Home Price · {marketLabel}
        </h2>
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
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors`}
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

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
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

      {/* SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          className="w-full"
          style={{ fontFamily: "Inter, sans-serif" }}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Grid lines */}
          {yTickValues.map((val) => (
            <g key={val}>
              <line
                x1={padLeft}
                y1={yPos(val)}
                x2={chartW - padRight}
                y2={yPos(val)}
                stroke="#F3F4F6"
                strokeWidth={1}
              />
              <text
                x={padLeft - 8}
                y={yPos(val) + 3}
                textAnchor="end"
                fill="#9CA3AF"
                fontSize={10}
              >
                {formatPrice(val)}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {priceHistory.map((d, i) => (
            <text
              key={i}
              x={xPos(i)}
              y={chartH - 8}
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize={10}
            >
              {d.month}
            </text>
          ))}

          {/* Lines */}
          {activeTypeArr.map((type) => (
            <path
              key={type}
              d={buildPath(type)}
              fill="none"
              stroke={PROPERTY_TYPE_CONFIG[type].color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Hover interaction zones */}
          {priceHistory.map((_, i) => (
            <rect
              key={i}
              x={xPos(i) - plotW / priceHistory.length / 2}
              y={padTop}
              width={plotW / priceHistory.length}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHoveredPoint(i)}
            />
          ))}

          {/* Hover vertical line + dots */}
          {hoveredPoint !== null && (
            <g>
              <line
                x1={xPos(hoveredPoint)}
                y1={padTop}
                x2={xPos(hoveredPoint)}
                y2={padTop + plotH}
                stroke="#D1D5DB"
                strokeWidth={1}
                strokeDasharray="4 2"
              />
              {activeTypeArr.map((type) => (
                <circle
                  key={type}
                  cx={xPos(hoveredPoint)}
                  cy={yPos(priceHistory[hoveredPoint][type])}
                  r={4}
                  fill="white"
                  stroke={PROPERTY_TYPE_CONFIG[type].color}
                  strokeWidth={2}
                />
              ))}
            </g>
          )}
        </svg>
      </div>

      {/* Tooltip below chart */}
      {hoveredPoint !== null && (
        <div className="flex items-center gap-4 mt-2 px-2">
          <span className="text-xs font-medium text-gray-500">
            {priceHistory[hoveredPoint].month}
          </span>
          {activeTypeArr.map((type) => (
            <div key={type} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PROPERTY_TYPE_CONFIG[type].color }}
              />
              <span className="text-xs text-gray-700">
                {PROPERTY_TYPE_CONFIG[type].label}:{" "}
                <span className="font-medium">
                  {formatPrice(priceHistory[hoveredPoint][type])}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
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
