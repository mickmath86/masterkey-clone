"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

/* ─────────────────────────────── HERO ─────────────────────────────── */
function HeroSection() {
  return (
    <section className="pt-[120px] pb-12 md:pb-16 bg-mk-cream">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12] text-gray-900 max-w-[900px] mx-auto mb-10">
          How MasterKey is transforming residential and commercial real estate
          in the Conejo Valley — powered by data, driven by people
        </h1>

        <div className="rounded-2xl overflow-hidden">
          <Image
            src="/about-hero.png"
            alt="Modern luxury home in Southern California at golden hour"
            width={1100}
            height={619}
            priority
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── STATS ─────────────────────────────── */
const stats = [
  { number: "200+", label: "families helped find their home in the Conejo Valley" },
  { number: "$150M+", label: "in combined transaction volume closed" },
  { number: "24", label: "average days on market for MasterKey listings" },
];

function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-mk-cream">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {stats.map((s) => (
            <div key={s.number} className="text-center py-6 md:py-0 md:px-8">
              <span className="block font-display text-4xl md:text-5xl text-gray-900 mb-2">
                {s.number}
              </span>
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── SIDEBAR + BODY ────────────────────────── */
function CompanyOverview() {
  return (
    <aside className="lg:sticky lg:top-[100px] self-start">
      {/* Logo / Brand */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          {/* Simple MK mark */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className="w-10 h-10"
            aria-label="MasterKey logo mark"
          >
            <rect width="40" height="40" rx="8" fill="#1A4D4D" />
            <path
              d="M10 28V12l6 8 4-5 4 5 6-8v16"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <div className="leading-tight">
            <span className="block text-base font-semibold text-gray-900">
              MasterKey
            </span>
            <span className="block text-xs text-gray-400">Real Estate</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        MasterKey is a residential and commercial real estate brokerage
        headquartered in Thousand Oaks, California. Specializing in the Conejo
        Valley and greater Ventura County, we combine deep local market
        knowledge with AI-powered analytics to help buyers, sellers, investors,
        and developers make smarter, faster decisions.
      </p>

      <a
        href="https://usemasterkey.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-mk-teal transition-colors"
      >
        Company website <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </aside>
  );
}

/* ──────────────────── SECTION LABEL HELPER ──────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <span className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-4">
      {children}
    </span>
  );
}

/* ──────────────────────── THE STORY (Problem) ──────────────────────── */
function ProblemSection() {
  return (
    <div className="mb-16">
      <SectionLabel>Our Story</SectionLabel>

      <h2 className="font-display text-2xl md:text-3xl text-gray-900 mb-6">
        A market moving faster than the tools built to serve it
      </h2>

      <div className="space-y-5 text-base text-gray-500 leading-relaxed">
        <p>
          The Conejo Valley has always been one of Southern California&apos;s
          most desirable markets — excellent schools, safe neighborhoods, and a
          quality of life that attracts families and investors alike. But as
          competition intensified and data became more fragmented across dozens
          of platforms, the traditional brokerage model started showing cracks.
        </p>

        <p className="text-gray-700 italic">
          &ldquo;Clients were coming to us with more information than ever, but
          the insights they needed — neighborhood-level trends, pricing
          nuances, investment projections — were scattered across MLS feeds,
          county records, and a dozen different websites,&rdquo; recalls
          MasterKey&apos;s founding team. &ldquo;We knew there had to be a
          better way.&rdquo;
        </p>

        <p>
          Agents were spending hours manually pulling comps, cross-referencing
          school ratings, and building market reports from scratch. Investors
          needed CAP rate analysis that required juggling multiple spreadsheets.
          First-time buyers felt overwhelmed by the sheer volume of
          disconnected data.
        </p>

        <p className="text-gray-700 italic">
          &ldquo;For every listing presentation, we were rebuilding the same
          analysis from scratch. Neighborhood reports, price trends,
          demographic data — it took hours of manual work that should have been
          instant,&rdquo; the team recalls.
        </p>

        <p>
          The fragmented tooling, slow manual processes, and the gap between
          available data and actionable intelligence made it clear: the Conejo
          Valley needed a brokerage built for the modern market — one that puts
          technology at the center of every transaction.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────── QUOTE BLOCK ──────────────────────────── */
function QuoteBlock() {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 md:p-10 mb-16">
      <blockquote className="font-display text-xl md:text-2xl text-gray-900 leading-snug mb-6">
        &ldquo;MasterKey was born from a simple belief: every client deserves
        the kind of market intelligence that used to be reserved for
        institutional investors. Data-driven decisions shouldn&apos;t be a
        luxury — they should be the standard.&rdquo;
      </blockquote>
      <div>
        <span className="block text-sm font-semibold text-gray-900">
          MasterKey Founding Team
        </span>
        <span className="block text-sm text-gray-500">
          Thousand Oaks, California
        </span>
      </div>
    </div>
  );
}

/* ──────────────────────── THE APPROACH (Solution) ──────────────────── */
function SolutionSection() {
  return (
    <div className="mb-16">
      <SectionLabel>The Approach</SectionLabel>

      <h2 className="font-display text-2xl md:text-3xl text-gray-900 mb-6">
        A technology-forward brokerage built on local expertise and real-time
        market intelligence
      </h2>

      <div className="space-y-5 text-base text-gray-500 leading-relaxed">
        <p>
          MasterKey was built to bridge the gap between raw data and
          confident decisions. By combining decades of Conejo Valley expertise
          with AI-powered analytics and 20+ integrated data sources, every
          client gets institutional-grade market intelligence — whether
          they&apos;re buying their first home or scaling a multifamily
          portfolio.
        </p>

        <p className="font-medium text-gray-700">
          Our platform and process allow MasterKey clients to:
        </p>

        <ul className="list-disc pl-6 space-y-3 text-gray-500">
          <li>
            <span className="font-semibold text-gray-700">
              Access real-time market data
            </span>{" "}
            across every Conejo Valley ZIP code — median prices, days on
            market, inventory levels, and price-per-square-foot trends — all
            synthesized from MLS, county records, and proprietary sources
          </li>
          <li>
            <span className="font-semibold text-gray-700">
              Get neighborhood-level intelligence
            </span>{" "}
            including school ratings, walkability scores, demographic
            profiles, and development pipeline data that most brokerages
            simply don&apos;t surface
          </li>
          <li>
            <span className="font-semibold text-gray-700">
              Receive AI-generated property analysis
            </span>{" "}
            — automated CMAs, investment projections, and listing
            optimization recommendations that take minutes instead of hours
          </li>
          <li>
            <span className="font-semibold text-gray-700">
              Benefit from proactive alerts
            </span>{" "}
            for new listings, price changes, and market shifts tailored to
            each client&apos;s specific criteria and timeline
          </li>
        </ul>

        <p className="text-gray-700 italic">
          &ldquo;The ability to pull source-cited market data in seconds means
          we can have informed conversations with clients on the spot — no
          more &apos;let me get back to you on that.&apos; It&apos;s a
          completely different level of service,&rdquo; says the MasterKey
          team.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────── THE RESULTS ──────────────────────── */
function ResultSection() {
  return (
    <div className="mb-16">
      <SectionLabel>The Results</SectionLabel>

      <h2 className="font-display text-2xl md:text-3xl text-gray-900 mb-6">
        Faster closings, smarter pricing, and a new standard for client
        service in the Conejo Valley
      </h2>

      <div className="space-y-5 text-base text-gray-500 leading-relaxed">
        <p>
          Since launching our technology-forward approach, MasterKey has
          redefined what clients expect from a local brokerage. The results
          speak for themselves:
        </p>

        <ul className="list-disc pl-6 space-y-3 text-gray-500">
          <li>
            <span className="font-semibold text-gray-700">
              24 average days on market
            </span>{" "}
            for MasterKey listings — well below the Conejo Valley average,
            driven by data-optimized pricing and targeted marketing
          </li>
          <li>
            <span className="font-semibold text-gray-700">
              98% of listings sold at or above asking price
            </span>{" "}
            — our AI-powered CMA ensures every property is positioned for
            maximum return
          </li>
          <li>
            <span className="font-semibold text-gray-700">
              Buyer clients save an average of $35K
            </span>{" "}
            below market through data-backed negotiation strategies and
            off-market opportunity identification
          </li>
          <li>
            <span className="font-semibold text-gray-700">
              Investment clients access institutional-grade analysis
            </span>{" "}
            — CAP rate projections, cash flow modeling, and absorption
            studies that used to require a dedicated research team
          </li>
        </ul>

        <p className="text-gray-700 italic">
          &ldquo;We had a seller who was skeptical about pricing above
          market. Our data showed a 12% under-valuation based on recent
          comparable sales and neighborhood trajectory. They listed at our
          recommendation and closed 5% over asking in 11 days,&rdquo; the
          team recounts.
        </p>

        <p>
          Beyond transactions, MasterKey is committed to building long-term
          relationships. Our MarketPulse dashboard gives clients ongoing access
          to real-time market data — even after their transaction closes —
          because we believe informed homeowners are better homeowners.
        </p>

        <p className="text-gray-700 italic">
          &ldquo;Transparency and data integrity are at the core of everything
          we do. Every recommendation is backed by verifiable sources. Every
          market report cites its data. We don&apos;t do guesswork — we do
          analysis,&rdquo; says the MasterKey team.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────── CTA ────────────────────────────── */
function CTASection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="bg-mk-mint rounded-2xl py-14 px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-gray-900 mb-3">
            Ready to take the next step?
          </h2>
          <p className="text-base text-gray-500 mb-8">
            Discover how MasterKey can help you buy, sell, or invest with
            confidence
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center px-7 py-3 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors"
          >
            Get started
          </a>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── MAIN COMPOSED LAYOUT ────────────────────── */
export default function AboutContent() {
  return (
    <>
      <HeroSection />
      <StatsSection />

      {/* Two-column: sidebar + body */}
      <section className="py-12 md:py-20 bg-mk-cream">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16">
            <CompanyOverview />

            <div>
              <ProblemSection />
              <QuoteBlock />
              <SolutionSection />
              <ResultSection />
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
