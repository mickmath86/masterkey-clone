"use client";

import { useState } from "react";

const tabs = [
  {
    label: "Buyers",
    title: "Find your perfect home faster",
    text: "From first-time buyers to luxury seekers, our AI-powered search matches you with properties that fit your lifestyle, budget, and timeline. We handle the research so you can focus on choosing your future home.",
    demo: "Analyzing 142 active listings in Conejo Valley against your criteria: 4BD+, updated kitchen, good schools, under $1.2M. Found 8 strong matches with 3 below-market opportunities.",
  },
  {
    label: "Sellers",
    title: "Maximize your home's value",
    text: "Data-driven pricing strategy, professional staging guidance, and targeted marketing campaigns that put your property in front of the right buyers at the right time.",
    demo: "Comparative analysis complete: Your home at 456 Oak St is positioned 8% above median for the neighborhood. Recommended list price $1,150,000 based on 12 comparable sales.",
  },
  {
    label: "Investors",
    title: "Build and grow your portfolio",
    text: "Identify undervalued properties, analyze CAP rates, and model cash flow projections across the Conejo Valley and greater LA area. Multifamily, commercial, and residential investment strategies.",
    demo: "Portfolio analysis: 3 multifamily opportunities identified in 91360. Projected NOI range $48K-$72K annually. Cap rates 5.2%-7.1%. Financing options pre-qualified.",
  },
  {
    label: "Developers",
    title: "Accelerate your development cycles",
    text: "Site selection, feasibility analysis, entitlement research, and market absorption studies. MasterKey's data platform speeds up every phase of the development process.",
    demo: "Feasibility report: 2.3-acre parcel on Thousand Oaks Blvd zoned for 24 units. Estimated build cost $8.2M. Projected sell-out $14.1M based on current market absorption rates.",
  },
  {
    label: "Relocation",
    title: "Seamless moves to Southern California",
    text: "Comprehensive relocation packages including neighborhood guides, school analysis, commute mapping, and community introductions. We make moving to the Conejo Valley effortless.",
    demo: "Relocation package ready: 5 neighborhoods match your family's needs. School ratings 8+, commute to Century City under 45 min, median home price $850K-$1.1M.",
  },
];

export default function Departments() {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <section className="py-16 md:py-24 bg-mk-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-gray-900">
            Solutions for every real estate goal.
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap overflow-x-auto">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                i === active
                  ? "bg-white text-gray-900 border-gray-300 shadow-sm"
                  : "text-gray-400 border-gray-200 hover:border-mk-teal hover:text-mk-teal"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div>
            <h3 className="font-display text-2xl lg:text-3xl text-gray-900 mb-4">
              {tab.title}
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              {tab.text}
            </p>
          </div>

          <div className="bg-gray-100 rounded-2xl aspect-[4/3] flex items-center justify-center p-6">
            <div className="bg-white rounded-xl p-5 shadow-md w-[85%] text-sm text-gray-500 leading-relaxed">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                MasterKey AI Analysis
              </p>
              {tab.demo}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
