"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "What areas does MasterKey serve?",
    a: "We specialize in Thousand Oaks, Westlake Village, Newbury Park, Agoura Hills, Oak Park, and the greater Conejo Valley. We also serve clients across Ventura County and the broader Los Angeles metro area.",
  },
  {
    q: "How is MasterKey different from other brokerages?",
    a: "We combine deep local expertise with advanced market analytics and AI-powered tools. Every recommendation is data-backed, every listing is optimized with real-time market intelligence, and every client gets hands-on personal attention — not a call center.",
  },
  {
    q: "What types of properties do you handle?",
    a: "Residential single-family homes, condos and townhomes, luxury estates, multifamily investment properties, commercial real estate, and development land parcels. Our team has experience across all property types in Southern California.",
  },
  {
    q: "How do your market analytics work?",
    a: "We pull from 20+ data sources including MLS, county records, Zillow, Redfin, and proprietary databases. Our AI platform synthesizes this data into actionable insights — pricing recommendations, trend analysis, and neighborhood comparisons — updated in real time.",
  },
  {
    q: "Do you work with first-time buyers?",
    a: "Absolutely. We specialize in guiding first-time buyers through every step — from pre-approval and neighborhood selection to offer strategy and closing. Our Buyer's Playbook is a free resource for anyone starting their journey.",
  },
  {
    q: "What does a consultation cost?",
    a: "Initial consultations are always free. We'll discuss your goals, timeline, and budget, then create a customized strategy. There's no obligation — just an honest conversation about your best options.",
  },
  {
    q: "Can you help with investment property analysis?",
    a: "Yes. We provide detailed CAP rate analysis, cash flow projections, comparable property research, and market absorption studies. Whether you're buying your first rental or building a portfolio, our data platform gives you a competitive edge.",
  },
  {
    q: "How quickly can you get me into a property?",
    a: "Our average from first contact to accepted offer is 21 days for buyers, and our listings average 24 days on market. With pre-approval and clear criteria, we can move even faster in competitive situations.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-mk-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-gray-900">
            FAQs
          </h2>
        </div>

        <div className="max-w-[800px] mx-auto">
          {faqs.map((faq, i) => {
            const isOpen = i === openIndex;
            return (
              <div key={i} className="border-b border-gray-200">
                <button
                  className="w-full flex items-center justify-between py-5 text-left text-base font-medium text-gray-900"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="pr-4">{faq.q}</span>
                  <Plus
                    className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ${
                    isOpen ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  <p className="pb-5 text-sm text-gray-500 leading-relaxed max-w-[680px]">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
