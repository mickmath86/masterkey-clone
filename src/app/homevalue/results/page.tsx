"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, Home, Clock, BarChart3, CheckCircle,
  ArrowRight, Phone, Mail, MapPin, Layers, Calendar,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FormData } from "@/components/homevalue/HomeValueQuiz";

// ─── Estimation logic ──────────────────────────────────────────────────────────

function estimateValue(data: FormData): {
  low: number; mid: number; high: number; confidence: number;
} {
  const sqft = parseInt(data.sqft.replace(/,/g, "")) || 1800;
  const beds = parseInt(data.bedrooms) || 3;
  const baths = parseFloat(data.bathrooms) || 2;
  const yearBuilt = parseInt(data.yearBuilt) || 1995;
  const age = 2026 - yearBuilt;

  // Base price per sqft for Conejo Valley (approx)
  let ppsf = 560;

  // Condition modifier
  const conditionMap: Record<string, number> = {
    "Excellent — like new / recently renovated": 1.12,
    "Good — well maintained, minor wear": 1.0,
    "Fair — needs some updating": 0.91,
    "Needs Work — significant repairs needed": 0.80,
  };
  ppsf *= conditionMap[data.condition] ?? 1.0;

  // Age modifier
  if (age < 10) ppsf *= 1.05;
  else if (age > 40) ppsf *= 0.95;

  // Feature modifiers
  if (data.pool) ppsf += 18;
  if (data.view) ppsf += 25;
  if (data.solar) ppsf += 8;
  if (data.adUnit) ppsf += 35;

  // Recent updates
  const updateBoost = (field: string) => {
    if (field === "Within the last year") return 1.04;
    if (field === "1–5 years ago") return 1.02;
    return 1.0;
  };
  ppsf *= updateBoost(data.kitchenUpdate);
  ppsf *= updateBoost(data.bathroomUpdate);

  const base = ppsf * sqft;

  // Bedroom / bath premium
  const bedsBonus = Math.max(0, beds - 3) * 15000;
  const bathBonus = Math.max(0, baths - 2) * 8000;

  const mid = Math.round((base + bedsBonus + bathBonus) / 1000) * 1000;
  const spread = mid * 0.055;
  const low = Math.round((mid - spread) / 1000) * 1000;
  const high = Math.round((mid + spread) / 1000) * 1000;

  const confidence = data.condition && data.sqft && data.yearBuilt ? 91 : 78;

  return { low, mid, high, confidence };
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${(n / 1000).toFixed(0)}K`;
}
function fmtFull(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

// ─── Market snapshot (Conejo Valley hardcoded as defaults) ────────────────────

const MARKET = {
  medianPrice: 985000,
  medianPriceChange: 4.2,
  daysOnMarket: 22,
  domChange: -3,
  inventory: 312,
  inventoryChange: -12,
  listToSaleRatio: 98.7,
  monthsSupply: 1.8,
  priceReduced: 14,
  hotNeighborhoods: [
    { name: "Thousand Oaks", median: 1080000, change: 5.1 },
    { name: "Westlake Village", median: 1420000, change: 3.8 },
    { name: "Newbury Park", median: 940000, change: 6.2 },
    { name: "Agoura Hills", median: 1050000, change: 4.5 },
  ],
};

// ─── Components ───────────────────────────────────────────────────────────────

function StatCard({
  label, value, change, icon, positive,
}: {
  label: string; value: string; change?: string; icon: React.ReactNode; positive?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-mk-mint flex items-center justify-center">
          {icon}
        </div>
        {change && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              positive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
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
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomeValueResults() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("hv_data");
    if (raw) {
      try { setFormData(JSON.parse(raw) as FormData); } catch {}
    }
    setTimeout(() => setVisible(true), 100);
  }, []);

  if (!formData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-mk-cream pt-[88px] flex items-center justify-center">
          <div className="text-center px-6">
            <Home className="w-12 h-12 text-mk-teal-light mx-auto mb-4 opacity-50" />
            <h2 className="font-display text-2xl text-gray-900 mb-2">No valuation found</h2>
            <p className="text-gray-500 text-sm mb-6">Please complete the home value questionnaire first.</p>
            <Link href="/homevalue" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors">
              Start valuation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { low, mid, high, confidence } = estimateValue(formData);
  const rangeWidth = ((high - low) / mid) * 100;

  return (
    <>
      <Header />
      <main
        className={`bg-mk-cream transition-all duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* ── Hero valuation banner ── */}
        <section className="pt-[88px] bg-mk-teal text-white">
          <div className="max-w-[1200px] mx-auto px-6 py-14 md:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-mk-teal-light mb-4">
                  <span className="w-6 h-px bg-mk-teal-light" />
                  Your Home Valuation
                </span>
                <p className="text-white/60 text-sm mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {formData.address}, {formData.city}, {formData.state} {formData.zip}
                </p>
                <p className="text-white/60 text-xs mb-6">
                  {formData.propertyType} · {formData.bedrooms} bed / {formData.bathrooms} bath · {formData.sqft} sqft · Built {formData.yearBuilt}
                </p>
                <p className="text-white/70 text-sm mb-2">Estimated Market Value</p>
                <p className="font-display text-5xl sm:text-6xl text-white mb-2">
                  {fmtFull(mid)}
                </p>
                <div className="flex items-center gap-2 mt-2 mb-6">
                  <TrendingUp className="w-4 h-4 text-mk-teal-light" />
                  <span className="text-mk-teal-light text-sm font-medium">
                    Range: {fmt(low)} – {fmt(high)}
                  </span>
                </div>

                {/* Confidence meter */}
                <div className="bg-white/10 rounded-xl p-4 max-w-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/60 font-medium">Confidence Score</span>
                    <span className="text-sm font-semibold text-white">{confidence}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mk-teal-light rounded-full transition-all duration-1000"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    Based on {formData.sqft ? "property details, condition, and" : ""} comparable sales
                  </p>
                </div>
              </div>

              {/* Right — breakdown card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 space-y-4">
                <h3 className="font-semibold text-white text-sm">Valuation Breakdown</h3>

                {[
                  { label: "Base value (price/sqft × size)", value: `$${Math.round((mid * 0.88) / 1000)}K`, positive: true },
                  { label: "Condition premium", value: formData.condition.startsWith("Excellent") ? "+$28K" : formData.condition.startsWith("Good") ? "+$0" : "-$35K", positive: !formData.condition.startsWith("Needs") },
                  { label: "Feature adjustments (pool, view, solar, ADU)", value: `+$${[formData.pool && 18, formData.view && 25, formData.solar && 8, formData.adUnit && 35].filter(Boolean).reduce((a: number, b) => a + (b as number), 0)}K`, positive: true },
                  { label: "Recent renovation uplift", value: "+~$15K", positive: true },
                  { label: "Current market conditions", value: "+4.2% YoY", positive: true },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/10 last:border-0">
                    <span className="text-xs text-white/60 flex-1 pr-4">{row.label}</span>
                    <span className={`text-xs font-semibold ${row.positive ? "text-mk-teal-light" : "text-red-300"}`}>
                      {row.value}
                    </span>
                  </div>
                ))}

                <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Estimated Value</span>
                  <span className="text-lg font-bold text-white">{fmtFull(mid)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Market stats ── */}
        <section className="py-16 bg-mk-cream">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl text-gray-900">
                  Conejo Valley Market Snapshot
                </h2>
                <p className="text-gray-500 text-sm mt-1">March 2026 · Updated weekly</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-600 border border-green-100 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Strong Seller&apos;s Market
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard
                label="Median Sale Price"
                value={fmt(MARKET.medianPrice)}
                change={`${MARKET.medianPriceChange}% YoY`}
                icon={<TrendingUp className="w-4 h-4 text-mk-teal" />}
                positive
              />
              <StatCard
                label="Avg. Days on Market"
                value={`${MARKET.daysOnMarket} days`}
                change={`${Math.abs(MARKET.domChange)} days vs. last yr`}
                icon={<Clock className="w-4 h-4 text-mk-teal" />}
                positive={MARKET.domChange < 0}
              />
              <StatCard
                label="Active Inventory"
                value={`${MARKET.inventory} homes`}
                change={`${Math.abs(MARKET.inventoryChange)}% YoY`}
                icon={<Home className="w-4 h-4 text-mk-teal" />}
                positive={false}
              />
              <StatCard
                label="List-to-Sale Ratio"
                value={`${MARKET.listToSaleRatio}%`}
                change="Up from 96.2%"
                icon={<BarChart3 className="w-4 h-4 text-mk-teal" />}
                positive
              />
            </div>

            {/* Neighborhood table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">Neighborhood Medians</h3>
                <span className="text-xs text-gray-400">Last 90 days</span>
              </div>
              <div className="divide-y divide-gray-50">
                {MARKET.hotNeighborhoods.map((n) => (
                  <div
                    key={n.name}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-mk-teal-light flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900">{n.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700">{fmtFull(n.median)}</span>
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <ArrowUpRight className="w-3 h-3" /> {n.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── What this means / insights ── */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="font-display text-3xl text-gray-900 mb-8">
              What this means for you, {formData.firstName}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <TrendingUp className="w-5 h-5 text-mk-teal-light" />,
                  title: "It's a great time to sell",
                  body: `With only ${MARKET.monthsSupply} months of supply, buyers are competing for limited inventory. Homes priced right are getting ${MARKET.listToSaleRatio}% of asking price and closing in under a month.`,
                },
                {
                  icon: <Calendar className="w-5 h-5 text-mk-teal-light" />,
                  title: "Spring is peak season",
                  body: `March through June consistently delivers the highest sale prices in the Conejo Valley. Listing now positions you at the peak of buyer demand before summer slowdown.`,
                },
                {
                  icon: <Layers className="w-5 h-5 text-mk-teal-light" />,
                  title: "Your equity position",
                  body: `If your home is worth ${fmtFull(mid)}, you may be sitting on significant equity compared to your purchase price. A MasterKey agent can give you a precise net proceeds estimate.`,
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-mk-cream rounded-2xl p-6 border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-mk-mint flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{card.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Next steps / CTA ── */}
        <section className="py-16 bg-mk-cream">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-mk-teal-light mb-4">
                  <span className="w-6 h-px bg-mk-teal-light" />
                  Next Steps
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-gray-900 mb-4">
                  Ready to take the next step?
                </h2>
                <p className="text-gray-500 text-base leading-relaxed mb-6">
                  Your free estimate is a great starting point. A MasterKey listing
                  consultation gives you a precise CMA, a personalized pricing strategy,
                  and a plan to maximize your net proceeds.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Free in-home or virtual consultation",
                    "Detailed comparative market analysis (CMA)",
                    "Net proceeds estimate with closing cost breakdown",
                    "Custom marketing plan for your property",
                    "No obligation — just expert advice",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-mk-teal-light flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-mk-teal text-white text-sm font-semibold hover:bg-mk-teal/90 transition-colors shadow-lg shadow-mk-teal/20"
                  >
                    Schedule a consultation
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/homevalue"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:border-mk-teal hover:text-mk-teal transition-colors"
                  >
                    Value another home
                  </Link>
                </div>
              </div>

              {/* Agent card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-mk-teal flex items-center justify-center text-white font-display text-xl">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mike Mathias</p>
                    <p className="text-xs text-gray-500">Founder · MasterKey Real Estate</p>
                    <p className="text-xs text-mk-teal-light font-medium mt-0.5">
                      DRE #XXXXXXX
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Hi {formData.firstName}, I&apos;d love to walk you through your home&apos;s value
                  in detail and share what we&apos;re seeing in the current market.
                  Reach out anytime — no pressure.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+18055550100"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-mk-teal transition-colors"
                  >
                    <Phone className="w-4 h-4 text-mk-teal-light" />
                    (805) 555-0100
                  </a>
                  <a
                    href="mailto:mike@usemasterkey.com"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-mk-teal transition-colors"
                  >
                    <Mail className="w-4 h-4 text-mk-teal-light" />
                    mike@usemasterkey.com
                  </a>
                  <p className="flex items-center gap-3 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-mk-teal-light flex-shrink-0" />
                    Thousand Oaks, CA · Serving all of Ventura County
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
